import { Header } from "~/components/Header";
import { StoreManagement } from "~/components/StoreManagement";
import { ProductManagement } from "~/components/ProductManagement";
import { PurchaseFlow } from "~/components/PurchaseFlow";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Dashboard() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Webstore Dashboard</h1>
        
        {!connected ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>Please connect your wallet to access the dashboard features.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Store Management</h2>
                <p className="text-gray-600 mb-4">Create and manage your store</p>
                <StoreManagement />
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Product Management</h2>
                <p className="text-gray-600 mb-4">Create and manage products</p>
                <ProductManagement />
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Purchase Flow</h2>
                <p className="text-gray-600 mb-4">Purchase products from stores</p>
                <PurchaseFlow />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}