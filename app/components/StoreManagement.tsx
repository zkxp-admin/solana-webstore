import { useState } from "react";
import { useProgram } from "~/solana/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";

export function StoreManagement() {
  const { connected, publicKey } = useWallet();
  const { createStoreSendAndConfirm, getStoreAccount } = useProgram();
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [storeData, setStoreData] = useState<any>(null);

  const handleCreateStore = async () => {
    if (!connected || !publicKey) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      // In a real implementation, you would generate proper signers
      // For now, we'll use placeholder signers
      const signers = {
        feePayer: Keypair.generate(),
        owner: Keypair.generate(),
      };
      
      const result = await createStoreSendAndConfirm({
        name: storeName,
        description: storeDescription,
        signers,
      });
      
      if (result.error) {
        setMessage(`Error: ${result.error.message}`);
      } else {
        setMessage("Store created successfully!");
        setStoreName("");
        setStoreDescription("");
        // In a real app, you would fetch the created store data
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Store</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="storeName">
            Store Name
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter store name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="storeDescription">
            Store Description
          </label>
          <textarea
            id="storeDescription"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter store description"
            rows={3}
          />
        </div>
        
        <button
          onClick={handleCreateStore}
          disabled={!connected || loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            !connected || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Creating..." : "Create Store"}
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