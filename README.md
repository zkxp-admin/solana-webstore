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
- **`create_store`** - Initialize a new store with name and description
- **`update_store_config`** - Modify store configuration, name, description, and active status

### Product Management
- **`create_product`** - Create a product listing with price, stock, and optional NFT metadata
- **`update_product`** - Update product details: name, price, stock, and active status

### Transaction Management
- **`purchase_product`** - Execute secure token transfer from buyer to store owner
- **`verify_license`** - Verify NFT product ownership and license validity

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

## Code Quality

### Format Code

```bash
npm run format      # Auto-format all files
npm run format:check # Check formatting without changes
```

## Contributing

Contributions are welcome! Please ensure:
- Code is properly formatted with Prettier
- TypeScript types are correct
- Smart contract tests pass
- Frontend builds without errors

## License

MIT License - See LICENSE file for details

---

**Created by ZKXP Innovation Inc.**

For more information, visit [zkxp.io](https://zkxp.io) or check the documentation in the `app/routes/docs.tsx` file.