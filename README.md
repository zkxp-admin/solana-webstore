# Solana Webstore

A full-stack decentralized webstore platform built on Solana by **ZKXP Innovation Inc.** This project combines a robust Anchor-based smart contract with a modern React frontend to enable secure, blockchain-based store and product management with NFT support.

## Overview

Solana Webstore is a complete solution for creating decentralized storefronts on the Solana blockchain. Store owners can create their own stores, list products (including NFT-based digital goods), and customers can purchase items directly through blockchain transactions with full transparency and immutability.

## Features

- **Store Management** - Create and configure decentralized stores with metadata
- **Product Management** - List and manage products with pricing, stock tracking, and active/inactive status
- **Secure Transactions** - Purchase products using Solana token transfers
- **NFT Support** - List digital goods as NFTs with metadata verification
- **License Verification** - Verify product licenses and ownership for NFT purchases
- **Multi-Wallet Support** - Connect with Phantom, Solflare, Ledger, and other Solana wallets
- **Type-Safe Frontend** - Full TypeScript implementation with React Router and Vite

## Technology Stack

### Smart Contract (Backend)
- **Anchor Framework** (v0.31.1) - Solana program development framework
- **Rust** - Type-safe smart contract implementation
- **SPL Token Program** - Token and NFT handling
- **Borsh** - Efficient serialization

### Web Application (Frontend)
- **React** (v19.1.0) - UI framework
- **React Router** (v7.7.1) - Application routing and SSR support
- **TypeScript** (v5.8.3) - Type safety and better developer experience
- **Tailwind CSS** (v4.1.4) - Utility-first styling
- **Vite** (v6.3.3) - Lightning-fast build tool
- **@coral-xyz/anchor** (v0.31.1) - Solana program client
- **@solana/wallet-adapter** - Multi-wallet integration

## Project Structure

```
solana-webstore/
├── app/                           # React Frontend Application
│   ├── components/                # Reusable UI components
│   │   ├── Header.tsx             # Navigation header
│   │   ├── StoreManagement.tsx    # Store CRUD operations
│   │   ├── ProductManagement.tsx  # Product listing management
│   │   └── PurchaseFlow.tsx       # Purchase workflow
│   ├── routes/                    # Page routes
│   │   ├── home.tsx               # Landing page
│   │   ├── dashboard.tsx          # Main application dashboard
│   │   └── docs.tsx               # Usage documentation
│   ├── solana/                    # Blockchain integration
│   │   ├── useProgram.ts          # React hook for program instructions
│   │   ├── SolanaProvider.tsx     # Wallet configuration and setup
│   │   └── client/                # Program client utilities
│   │       ├── index.ts           # Client initialization
│   │       ├── pda.ts             # Program Derived Accounts
│   │       └── rpc.ts             # RPC utilities
│   └── root.tsx                   # App layout wrapper
│
├── programs/webstore/             # Solana Smart Contract
│   └── src/
│       ├── lib.rs                 # Program entry point and instructions
│       ├── instructions/          # Individual instruction handlers
│       │   ├── create_store.rs
│       │   ├── update_store_config.rs
│       │   ├── create_product.rs
│       │   ├── update_product.rs
│       │   ├── purchase_product.rs
│       │   └── verify_license.rs
│       ├── state/                 # Account data structures
│       │   ├── store.rs
│       │   ├── product.rs
│       │   └── purchase.rs
│       ├── constants.rs           # Program constants
│       └── error.rs               # Custom error codes
│
├── package.json                   # Frontend dependencies and scripts
├── Anchor.toml                    # Anchor framework configuration
├── Cargo.toml                     # Rust workspace configuration
├── vite.config.ts                 # Vite build configuration
├── react-router.config.ts         # React Router configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── Dockerfile                     # Production container setup
└── README.md                      # This file
```

## Program Instructions

The smart contract implements 6 core instructions for store and product management:

### Store Management

#### `create_store`
Initialize a new store on the blockchain.

**Parameters**:
- `name: String` - Store name (up to 255 characters)
- `description: String` - Store description/metadata

**Accounts Used**:
- Store PDA (derived from `[b"store", owner_pubkey]`)
- System Program (for account creation)

**Returns**: `StoreAccount` with:
- `owner: Pubkey` - Store owner's wallet address
- `name: String` - Store name
- `description: String` - Store description
- `is_active: bool` - Active/inactive status (default: true)
- `total_products: u64` - Product counter
- `bump: u8` - PDA bump seed

#### `update_store_config`
Modify an existing store's configuration.

**Parameters**:
- `name: Option<String>` - New store name (optional)
- `description: Option<String>` - New description (optional)
- `is_active: Option<bool>` - New active status (optional)

**Security**: Only store owner can call this instruction.

---

### Product Management

#### `create_product`
Create a new product listing in a store.

**Parameters**:
- `product_id: u64` - Unique product identifier within store
- `name: String` - Product name
- `description: String` - Product description
- `price: u64` - Price in lamports (1 SOL = 1,000,000,000 lamports)
- `stock: u64` - Initial stock quantity
- `is_nft: bool` - Whether this is an NFT product
- `metadata: Option<String>` - NFT metadata URI (if is_nft = true)

**Accounts Created**:
1. **ProductAccount** (683 bytes) - Product listing data
2. **SPL Token Mint** - Token mint for the product
3. **NftMetadataAccount** (2176 bytes) - NFT metadata (if is_nft = true)

**Returns**: `ProductAccount` containing product details and associated mint address.

#### `update_product`
Update product details (price, stock, name, active status).

**Parameters**:
- `name: Option<String>` - New product name (optional)
- `description: Option<String>` - New description (optional)
- `price: Option<u64>` - New price in lamports (optional)
- `stock: Option<u64>` - New stock quantity (optional)
- `is_active: Option<bool>` - New active status (optional)

**Security**: Only store owner can update products.

---

### Transaction Management

#### `purchase_product`
Purchase a product from a store (executes token transfer).

**Parameters**:
- `amount: u64` - Purchase amount in lamports (must match product price)

**Process**:
1. Transfers tokens from buyer to store owner
2. Decrements product stock
3. Creates immutable `PurchaseAccount` record

**Accounts Used**:
- Buyer's token account (payer)
- Store owner's token account (receiver)
- `PurchaseAccount` PDA - Records transaction for verification

**Returns**: `PurchaseAccount` with:
- `buyer: Pubkey` - Buyer's wallet address
- `product: Pubkey` - Product purchased
- `amount: u64` - Amount paid in lamports
- `timestamp: i64` - Unix timestamp of purchase

#### `verify_license`
Verify NFT product ownership and license validity (for license verification flow).

**Parameters**:
- `nft_mint: Pubkey` - NFT mint address to verify ownership

**Note**: Currently a placeholder implementation. Production systems should integrate with Metaplex Token Metadata standard for full NFT verification.

## Getting Started

### Prerequisites
- **Rust** 1.70 or higher
- **Solana CLI** - Latest version
- **Anchor CLI** - v0.31.1
- **Node.js** - v18 or higher
- **npm** or **yarn** - Package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/zkxp-innovation/solana-webstore.git
cd solana-webstore

# Install dependencies
npm install
```

### Development

#### Running the Frontend

```bash
# Start development server with hot reload
npm run dev

# Type check and generate router types
npm run typecheck

# Format code with Prettier
npm run format
```

The frontend will be available at `http://localhost:5173` (or the next available port).

#### Building the Smart Contract

```bash
# Build the Solana program
anchor build

# Run smart contract tests
anchor test
```

#### Building for Production

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

### Deployment

#### Smart Contract Deployment

```bash
# Deploy to local validator
anchor deploy

# Deploy to Solana Devnet
anchor deploy --provider.cluster devnet

# Deploy to Solana Testnet
anchor deploy --provider.cluster testnet

# Deploy to Solana Mainnet
anchor deploy --provider.cluster mainnet
```

After deployment, update the `VITE_SOLANA_PROGRAM_ID` environment variable with the deployed program ID.

#### Frontend Deployment

#### Environment Configuration

Create a `.env` file in the project root:

```env
# Solana Program ID (from deployment)
VITE_SOLANA_PROGRAM_ID=<YOUR_DEPLOYED_PROGRAM_ID>

# Solana Network: localnet | devnet | testnet | mainnet
VITE_SOLANA_NETWORK=devnet
```

#### Docker Deployment

Build and run the application in Docker:

```bash
# Build Docker image
docker build -t solana-webstore:latest .

# Run container
docker run -p 3000:3000 solana-webstore:latest
```

## Usage

### For Store Owners

1. **Connect Wallet** - Click "Connect" and select your Solana wallet (Phantom, Solflare, etc.)
2. **Create Store** - Fill in store details (name, description)
3. **Add Products** - List products with prices, descriptions, and optional NFT metadata
4. **Manage Inventory** - Update product prices, stock, and active status

### For Customers

1. **Connect Wallet** - Connect your Solana wallet
2. **Browse Products** - Explore available products in stores
3. **Purchase** - Complete purchases with secure on-chain transactions
4. **Verify License** - For NFT products, verify ownership and license

## Security Features

- **Account Validation** - All instructions validate account ownership and signer authorization
- **PDA Derivation** - Proper Program Derived Account (PDA) usage for deterministic accounts
- **Rent Exemption** - All initialized accounts maintain minimum balance for rent exemption
- **CPI Transfers** - Token transfers executed securely through Cross-Program Invocation (CPI)
- **Error Handling** - Comprehensive error codes and edge case handling
- **Type Safety** - Full TypeScript and Rust type checking throughout the codebase

## Testing

### Frontend Tests

```bash
npm run test
```

### Smart Contract Tests

```bash
anchor test
```

## Account Structure and PDAs

The smart contract uses Program Derived Accounts (PDAs) for deterministic, collision-free account generation:

### Store Account
- **Size**: 634 bytes
- **PDA Derivation**: `[b"store", owner_pubkey]`
- **Fields**:
  - `owner: Pubkey` - Store owner's wallet address
  - `name: String` - Store name
  - `description: String` - Store description
  - `is_active: bool` - Whether store is accepting products/purchases
  - `total_products: u64` - Number of products in this store
  - `bump: u8` - PDA bump seed for account derivation

### Product Account
- **Size**: 683 bytes
- **PDA Derivation**: `[b"product", store_pubkey, product_id]`
- **Fields**:
  - `store: Pubkey` - Reference to parent store
  - `product_id: u64` - Unique ID within store
  - `name: String` - Product name
  - `description: String` - Product description
  - `price: u64` - Price in lamports
  - `stock: u64` - Available quantity
  - `is_active: bool` - Whether product can be purchased
  - `is_nft: bool` - Whether this is an NFT product
  - `metadata_mint: Option<Pubkey>` - Associated NFT mint (if is_nft = true)
  - `bump: u8` - PDA bump seed

### Purchase Account
- **Size**: 89 bytes
- **PDA Derivation**: `[b"purchase", buyer_pubkey, product_pubkey]`
- **Fields**:
  - `buyer: Pubkey` - Buyer's wallet address
  - `product: Pubkey` - Product purchased
  - `amount: u64` - Amount paid in lamports
  - `timestamp: i64` - Unix timestamp of purchase (immutable record)

### NFT Metadata Account
- **Size**: 2176 bytes
- **PDA Derivation**: `[b"metadata", metadata_mint_pubkey]`
- **Fields**:
  - `mint: Pubkey` - Associated token mint
  - `name: String` - NFT name
  - `symbol: String` - Token symbol
  - `uri: String` - Metadata URI
  - `decimals: u8` - Token decimals
  - `is_fungible: bool` - Fungibility flag

---

## Error Codes

The program defines the following error codes for transaction validation:

| Code | Name | Description |
|------|------|-------------|
| 6000 | `Unauthorized` | Signer is not authorized for this operation |
| 6001 | `StoreNotFound` | Referenced store account does not exist |
| 6002 | `ProductNotFound` | Referenced product account does not exist |
| 6003 | `InsufficientStock` | Product has insufficient stock for purchase |
| 6004 | `InsufficientFunds` | Buyer has insufficient balance for transaction |
| 6005 | `ProductNotActive` | Product is marked as inactive and cannot be purchased |
| 6006 | `StoreNotActive` | Store is marked as inactive |
| 6007 | `InvalidProductId` | Product ID is invalid or out of range |
| 6008 | `LicenseNotValid` | NFT license verification failed |

---

## Frontend Components

The React application provides a user interface for interacting with the smart contract:

### Components

#### Header.tsx
Navigation bar with:
- Logo and branding
- Links to Vite, React Router, and Solana documentation
- Wallet connection/disconnection button
- Public key display (truncated for privacy)

#### StoreManagement.tsx
Store creation and management interface:
- Form to create new stores (name, description)
- Displays connected wallet's stores
- Uses `useProgram().createStoreSendAndConfirm()` for transactions

#### ProductManagement.tsx
Product listing and management:
- Display products from selected store
- Create new products with pricing and stock
- Update product details and active status
- Integrates with SPL Token minting for products

#### PurchaseFlow.tsx
Customer purchase interface:
- Search and browse products
- Purchase flow with transaction confirmation
- Handles SOL-based token transfers
- Records purchase on-chain

### Hooks

#### useProgram()
Main hook for smart contract interaction, providing:

**Instruction Methods** (send transactions):
- `createStoreSendAndConfirm(name, description)` → `StoreAccount`
- `updateStoreConfigSendAndConfirm(storeKey, updates)` → Updated `StoreAccount`
- `createProductSendAndConfirm(storeKey, product_id, details)` → `ProductAccount`
- `updateProductSendAndConfirm(productKey, updates)` → Updated `ProductAccount`
- `purchaseProductSendAndConfirm(productKey, amount)` → `PurchaseAccount`
- `verifyLicenseSendAndConfirm(nftMint)` → License verification result

**Account Fetchers**:
- `getStoreAccount(storeKey)` → `StoreAccount | null`
- `getProductAccount(productKey)` → `ProductAccount | null`
- `getPurchaseAccount(purchaseKey)` → `PurchaseAccount | null`
- `getNftMetadataAccount(metadataKey)` → `NftMetadataAccount | null`

**PDA Derivers**:
- `deriveProgramStoreAccount(owner)` → PDA address
- `deriveProgramProductAccount(store, product_id)` → PDA address
- `deriveProgramPurchaseAccount(buyer, product)` → PDA address
- `deriveProgramNftMetadataAccount(mint)` → PDA address
- `getProgramId()` → Current program ID from environment

### SolanaProvider.tsx
Wallet configuration and connection setup:
- Multi-wallet support (Phantom, Solflare, Ledger, UnsafeBurner)
- Cluster configuration (localnet/devnet/testnet/mainnet)
- RPC endpoint management
- Wallet selection UI

---

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# REQUIRED: Solana program ID (obtained after deploying the smart contract)
VITE_SOLANA_PROGRAM_ID=G1Gu4pWjLjHdDFFKmfYN3H8FMPbYjKs9r14mN3oqw9UU

# Network selection: localnet | devnet | testnet | mainnet (default: localnet)
VITE_SOLANA_NETWORK=devnet

# Optional: Custom RPC endpoint (overrides network default)
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional: Comma-separated list of enabled wallets (default: all supported)
VITE_SOLANA_WALLETS=Phantom,Solflare,Ledger
```

**Example Configuration for Different Networks**:

```env
# Local Development
VITE_SOLANA_PROGRAM_ID=G1Gu4pWjLjHdDFFKmfYN3H8FMPbYjKs9r14mN3oqw9UU
VITE_SOLANA_NETWORK=localnet
VITE_SOLANA_RPC_URL=http://localhost:8899

# Devnet Deployment
VITE_SOLANA_PROGRAM_ID=G1Gu4pWjLjHdDFFKmfYN3H8FMPbYjKs9r14mN3oqw9UU
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## Integration Guide

### Using the Program Client in Your Own Application

To integrate the Solana Webstore program client in an external application:

1. **Install Dependencies**:
```bash
npm install @coral-xyz/anchor @solana/web3.js
```

2. **Import and Initialize**:
```typescript
import { useProgram } from './app/solana/useProgram';

const YourComponent = () => {
  const program = useProgram();

  // Create a store
  const result = await program.createStoreSendAndConfirm(
    "My Store",
    "My store description"
  );

  if (result.error) {
    console.error("Transaction failed:", result.error);
  } else {
    console.log("Store created:", result.signature);
  }
};
```

3. **Fetch Account Data**:
```typescript
const storeAccount = await program.getStoreAccount(storePublicKey);
console.log("Store:", storeAccount);
```

4. **Derive PDAs**:
```typescript
const storePDA = program.deriveProgramStoreAccount(ownerPublicKey);
const productPDA = program.deriveProgramProductAccount(storePDA, productId);
```

### Transaction Flow Example

```
User connects wallet
    ↓
Frontend displays stores and products
    ↓
User selects product and clicks "Purchase"
    ↓
Frontend constructs transaction with:
  - Purchase instruction (amount = product.price)
  - Buyer's token account
  - Store owner's token account
    ↓
Wallet signs transaction
    ↓
Transaction submitted to Solana RPC
    ↓
Program executes:
  - Validates buyer has sufficient balance
  - Transfers tokens from buyer to owner
  - Decrements product stock
  - Creates PurchaseAccount record
    ↓
Transaction confirmed on blockchain
    ↓
Frontend displays purchase confirmation
```

---

## Security Considerations & Known Limitations

### Security Features ✅
- **PDA Authorization**: All accounts use PDAs with proper seed derivation
- **Owner Verification**: State-changing instructions verify signer is account owner
- **Rent Exemption**: All created accounts maintain minimum balance
- **Token Transfers via CPI**: Uses Cross-Program Invocation for secure SPL token transfers
- **Immutable Records**: Purchase accounts are immutable once created
- **Type Safety**: Full Rust type system with compile-time guarantees

### Known Limitations ⚠️

1. **License Verification Placeholder**
   - `verify_license` instruction is not fully implemented
   - For production: Integrate with Metaplex Token Metadata standard
   - Currently only validates instruction structure, not NFT ownership

2. **NFT Metadata**
   - Uses custom NFT metadata account instead of Metaplex standard
   - May cause compatibility issues with NFT marketplaces
   - Recommendation: Migrate to Metaplex if ecosystem integration needed

3. **Token Account Management**
   - Frontend must manage associated token account setup
   - Buyers must have SOL token account before purchase
   - No automatic ATA (Associated Token Account) creation

4. **Stock Management**
   - No bulk stock updates or inventory management
   - Each product update transaction updates one field at a time
   - Stock decrements happen per purchase (no batch processing)

5. **Price Constraints**
   - Prices stored as u64 in lamports (max: ~4.6M SOL per product)
   - No dynamic pricing or discount mechanisms
   - No decimal precision in pricing

6. **Wallet Security**
   - Demo uses wallet seed phrase export (unsafe for production)
   - UnsafeBurner wallet included for development only
   - Production deployments must use secure wallet signers

### Recommendations for Production Deployment

1. **Implement Metaplex Integration**
   - Use Metaplex Token Metadata standard for NFTs
   - Enables marketplace compatibility
   - File: `/programs/webstore/src/instructions/verify_license.rs`

2. **Add Inventory Management**
   - Implement bulk update instructions
   - Add restock/reserve mechanics
   - Track inventory history

3. **Enhanced Security Audit**
   - Professional Rust security audit
   - Frontend security review
   - Wallet integration best practices review

4. **Testing Coverage**
   - Implement comprehensive unit and integration tests
   - Add frontend test suite (currently missing)
   - Create CI/CD pipeline with automated testing

5. **Performance Optimization**
   - Consider indexing products (currently O(n) lookups)
   - Add pagination for large store inventories
   - Optimize metadata account storage

---

## Code Quality

### Format Code

```bash
npm run format      # Auto-format all files with Prettier
npm run format:check # Check formatting without making changes
```

### Type Checking

```bash
npm run typecheck  # Run TypeScript type checking and generate router types
```

## Contributing

Contributions are welcome! Please ensure:
- Code is properly formatted with Prettier (`npm run format`)
- TypeScript types are correct (`npm run typecheck`)
- Smart contract tests pass (`anchor test`)
- Frontend builds without errors (`npm run build`)

---

## License

MIT License - See LICENSE file for details

---

**Created by ZKXP Innovation Inc.**
