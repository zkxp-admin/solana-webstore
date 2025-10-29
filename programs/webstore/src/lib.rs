
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use error::*;

declare_id!("G1Gu4pWjLjHdDFFKmfYN3H8FMPbYjKs9r14mN3oqw9UU");

#[program]
pub mod webstore {
    use super::*;

/// Create a new store with initial configuration
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` store: [StoreAccount] Store account to be created
/// 2. `[signer]` owner: [AccountInfo] Store owner account
/// 3. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
///
/// Data:
/// - name: [String] Store name
/// - description: [String] type
	pub fn create_store(ctx: Context<CreateStore>, name: String, description: String) -> Result<()> {
		create_store::handler(ctx, name, description)
	}

/// Update store configuration
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` store: [StoreAccount] Store account to update
/// 2. `[signer]` owner: [AccountInfo] Store owner account
///
/// Data:
/// - name: [Option<String>] New store name (optional)
/// - description: [Option<String>] type
/// - is_active: [Option<bool>] New active status (optional)
	pub fn update_store_config(ctx: Context<UpdateStoreConfig>, name: Option<String>, description: Option<String>, is_active: Option<bool>) -> Result<()> {
		update_store_config::handler(ctx, name, description, is_active)
	}

/// Create a new product listing
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` store: [StoreAccount] Store account to add product to
/// 2. `[writable]` product: [ProductAccount] Product account to be created
/// 3. `[signer]` owner: [AccountInfo] Store owner account
/// 4. `[writable, signer]` mint: [Mint] Mint account for NFT (if applicable)
/// 5. `[writable]` metadata: [NftMetadataAccount] NFT metadata account
/// 6. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
/// 7. `[writable, signer]` funding: [AccountInfo] Funding account (must be a system account)
/// 8. `[writable]` assoc_token_account: [AccountInfo] Associated token account address to be created
/// 9. `[]` wallet: [AccountInfo] Wallet address for the new associated token account
/// 10. `[]` token_program: [AccountInfo] SPL Token program
/// 11. `[]` token_program: [AccountInfo] Auto-generated, TokenProgram
/// 12. `[]` associated_token_program: [AccountInfo] Auto-generated, AssociatedTokenProgram
///
/// Data:
/// - product_id: [u64] Unique product identifier
/// - name: [String] Product name
/// - description: [String] type
/// - price: [u64] Product price in lamports
/// - stock: [u64] Available stock quantity
/// - is_active: [bool] Whether product is available for purchase
	pub fn create_product(ctx: Context<CreateProduct>, product_id: u64, name: String, description: String, price: u64, stock: u64, is_active: bool) -> Result<()> {
		create_product::handler(ctx, product_id, name, description, price, stock, is_active)
	}

/// Update product information
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` store: [StoreAccount] Store account containing product
/// 2. `[writable]` product: [ProductAccount] Product account to update
/// 3. `[signer]` owner: [AccountInfo] Store owner account
///
/// Data:
/// - product_id: [u64] Product identifier
/// - name: [Option<String>] New product name (optional)
/// - description: [Option<String>] type
/// - price: [Option<u64>] New product price (optional)
/// - stock: [Option<u64>] New stock quantity (optional)
/// - is_active: [Option<bool>] New active status (optional)
	pub fn update_product(ctx: Context<UpdateProduct>, product_id: u64, name: Option<String>, description: Option<String>, price: Option<u64>, stock: Option<u64>, is_active: Option<bool>) -> Result<()> {
		update_product::handler(ctx, product_id, name, description, price, stock, is_active)
	}

/// Purchase a product from the store
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` store: [StoreAccount] Store account
/// 2. `[writable]` product: [ProductAccount] Product account to purchase
/// 3. `[writable]` purchase: [PurchaseAccount] Purchase record account
/// 4. `[signer]` buyer: [AccountInfo] Buyer account
/// 5. `[writable]` buyer_token_account: [AccountInfo] Buyer's token account
/// 6. `[writable]` store_token_account: [AccountInfo] Store's token account
/// 7. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
/// 8. `[writable]` source: [AccountInfo] The source account.
/// 9. `[writable]` destination: [AccountInfo] The destination account.
/// 10. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 11. `[]` token_program: [AccountInfo] Auto-generated, TokenProgram
///
/// Data:
/// - owner: [Pubkey] Store owner for PDA derivation
/// - product_id: [u64] Product identifier
	pub fn purchase_product(ctx: Context<PurchaseProduct>, owner: Pubkey, product_id: u64) -> Result<()> {
		purchase_product::handler(ctx, owner, product_id)
	}

/// Verify product license (for NFT products)
///
/// Accounts:
/// 0. `[writable, signer]` fee_payer: [AccountInfo] 
/// 1. `[writable]` store: [StoreAccount] Store account
/// 2. `[writable]` product: [ProductAccount] Product account
/// 3. `[signer]` owner: [AccountInfo] Store owner account
/// 4. `[writable]` source: [AccountInfo] The source account.
/// 5. `[writable]` destination: [AccountInfo] The destination account.
/// 6. `[signer]` authority: [AccountInfo] The source account's owner/delegate.
/// 7. `[]` token_program: [AccountInfo] Auto-generated, TokenProgram
///
/// Data:
/// - product_id: [u64] Product identifier
/// - buyer: [Pubkey] Buyer account to verify license for
	pub fn verify_license(ctx: Context<VerifyLicense>, product_id: u64, buyer: Pubkey) -> Result<()> {
		verify_license::handler(ctx, product_id, buyer)
	}



}
