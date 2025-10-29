# Solana Webstore Program

A complete Solana program for creating and managing a decentralized webstore with NFT product support.

## Features

- Create and manage stores
- List and manage products (NFT-based)
- Purchase products with token transfers
- License verification for NFT products
- Store and product management with active status

## Project Structure

```
.
├── app/                    # React frontend application
├── programs/webstore/      # Solana program source code
│   ├── src/
│   │   ├── lib.rs          # Program entry point
│   │   ├── instructions/   # Instruction implementations
│   │   ├── state/          # Account structures
│   │   └── error.rs        # Custom error codes
├── target/                 # Compiled program artifacts
└── README.md               # This file
```

## Program Instructions

### Store Management
1. `create_store` - Create a new store with initial configuration
2. `update_store_config` - Update store configuration

### Product Management
3. `create_product` - Create a new product listing
4. `update_product` - Update product information

### Transaction Management
5. `purchase_product` - Purchase a product from the store
6. `verify_license` - Verify product license (for NFT products)

## Deployment

### Prerequisites
- Rust 1.70+
- Solana CLI
- Anchor CLI
- Node.js 18+

### Build and Deploy
```bash
# Build the program
anchor build

# Deploy to localnet
anchor deploy

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

## Frontend Usage

The frontend application is built with React and integrates with the Solana program through:
- Wallet adapter for wallet connectivity
- Anchor client for program interaction
- React Router for navigation

### Running the Frontend
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Testing

### Program Tests
```bash
# Run program tests
anchor test
```

### Frontend Tests
```bash
# Run frontend tests
npm run test
```

## Environment Configuration

Create a `.env` file in the project root with:
```env
VITE_SOLANA_PROGRAM_ID=YOUR_PROGRAM_ID
VITE_SOLANA_NETWORK=localnet
```

## Security Considerations

- All instructions validate account ownership
- Proper PDA derivation for all accounts
- Rent exemption for all initialized accounts
- Token transfers are handled through CPI
- Error handling for all edge cases

## License

MIT
```