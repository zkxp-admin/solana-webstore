import { useState } from "react";
import { useProgram } from "~/solana/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";

export function PurchaseFlow() {
  const { connected, publicKey } = useWallet();
  const { purchaseProductSendAndConfirm } = useProgram();
  const [owner, setOwner] = useState("");
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePurchase = async () => {
    if (!connected || !publicKey) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      const signers = {
        feePayer: Keypair.generate(),
        buyer: Keypair.generate(),
        authority: Keypair.generate(),
      };
      
      const result = await purchaseProductSendAndConfirm({
        owner: new PublicKey(owner),
        productId: BigInt(productId),
        signers,
      });
      
      if (result.error) {
        setMessage(`Error: ${result.error.message}`);
      } else {
        setMessage("Purchase successful!");
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Purchase Product</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="owner">
              Store Owner Public Key
            </label>
            <input
              id="owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter store owner public key"
            />
          </div>
          
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
        </div>
        
        <button
          onClick={handlePurchase}
          disabled={!connected || loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            !connected || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Purchase Product"}
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