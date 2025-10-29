import { useState } from "react";
import { useProgram } from "~/solana/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";

export function ProductManagement() {
  const { connected, publicKey } = useWallet();
  const { createProductSendAndConfirm } = useProgram();
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateProduct = async () => {
    if (!connected || !publicKey) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      const signers = {
        feePayer: Keypair.generate(),
        owner: Keypair.generate(),
        mint: Keypair.generate(),
        funding: Keypair.generate(),
      };
      
      const result = await createProductSendAndConfirm({
        productId: BigInt(productId),
        name: productName,
        description: productDescription,
        price: BigInt(price),
        stock: BigInt(stock),
        isActive: true,
        signers,
      });
      
      if (result.error) {
        setMessage(`Error: ${result.error.message}`);
      } else {
        setMessage("Product created successfully!");
        setProductId("");
        setProductName("");
        setProductDescription("");
        setPrice("");
        setStock("");
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Product</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productId">
              Product ID
            </label>
            <input
              id="productId"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product ID"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productName">
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product name"
            />
          </div>
          
          <div className="mb-4 md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productDescription">
              Product Description
            </label>
            <textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product description"
              rows={2}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price (lamports)
            </label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter price in lamports"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
              Stock Quantity
            </label>
            <input
              id="stock"
              type="text"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter stock quantity"
            />
          </div>
        </div>
        
        <button
          onClick={handleCreateProduct}
          disabled={!connected || loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            !connected || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
        
        {message && (
          <div className={`mt-4 p-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}