use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(
	product_id: u64,
	name: String,
	description: String,
	price: u64,
	stock: u64,
	is_active: bool,
)]
pub struct CreateProduct<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		mut,
		seeds = [
			b"store",
			owner.key().as_ref(),
		],
		bump,
	)]
	pub store: Account<'info, StoreAccount>,

	#[account(
		init,
		space=683,
		payer=fee_payer,
		seeds = [
			b"product",
			store.key().as_ref(),
			product_id.to_le_bytes().as_ref(),
		],
		bump,
	)]
	pub product: Account<'info, ProductAccount>,

	pub owner: Signer<'info>,

	#[account(
		init,
		payer = fee_payer,
		mint::decimals = 0,
	)]
	pub mint: Account<'info, Mint>,

	#[account(
		init,
		space=2176,
		payer=fee_payer,
		seeds = [
			b"metadata",
			mint.key().as_ref(),
		],
		bump,
	)]
	pub metadata: Account<'info, NftMetadataAccount>,

	pub system_program: Program<'info, System>,

	#[account(
		mut,
		owner=Pubkey::from_str("11111111111111111111111111111111").unwrap(),
	)]
	pub funding: Signer<'info>,

	#[account(
		init,
		payer = funding,
		associated_token::mint = mint,
		associated_token::authority = wallet,
		associated_token::token_program = token_program,
	)]
	pub assoc_token_account: Account<'info, TokenAccount>,

	/// CHECK: implement manual checks if needed
	pub wallet: UncheckedAccount<'info>,

	pub token_program: Program<'info, Token>,

	pub token_program: Program<'info, Token>,

	pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> CreateProduct<'info> {
	pub fn cpi_token_initialize_mint2(&self, decimals: u8, mint_authority: Pubkey, freeze_authority: Option<Pubkey>) -> Result<()> {
		anchor_spl::token::initialize_mint2(
			CpiContext::new(self.token_program.to_account_info(), 
				anchor_spl::token::InitializeMint2 {
					mint: self.mint.to_account_info()
				}
			),
			decimals, 
			mint_authority, 
			freeze_authority, 
		)
	}
	
	pub fn cpi_token_mint_to(&self, amount: u64) -> Result<()> {
		anchor_spl::token::mint_to(
			CpiContext::new(self.token_program.to_account_info(), 
				anchor_spl::token::MintTo {
					mint: self.mint.to_account_info(),
					to: self.assoc_token_account.to_account_info(),
					authority: self.owner.to_account_info()
				}
			),
			amount, 
		)
	}
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
pub fn handler(
	ctx: Context<CreateProduct>,
	product_id: u64,
	name: String,
	description: String,
	price: u64,
	stock: u64,
	is_active: bool,
) -> Result<()> {
    // Initialize the product account
    let product = &mut ctx.accounts.product;
    product.store = ctx.accounts.store.key();
    product.product_id = product_id;
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.is_active = is_active;
    product.metadata_mint = Some(ctx.accounts.mint.key());
    product.bump = ctx.bumps.product;
    
    // Initialize the NFT metadata account
    let metadata = &mut ctx.accounts.metadata;
    metadata.mint = ctx.accounts.mint.key();
    metadata.name = format!("{} NFT", product.name);
    metadata.symbol = product.name.chars().take(5).collect::<String>();
    metadata.uri = format!("https://example.com/nft/{}", product_id);
    metadata.is_fungible = false;
    metadata.bump = ctx.bumps.metadata;
    
    // Initialize the mint account
    ctx.accounts.cpi_token_initialize_mint2(
        0, // decimals
        ctx.accounts.owner.key(), // mint authority
        None, // freeze authority
    )?;
    
    // Mint one token to the associated token account
    ctx.accounts.cpi_token_mint_to(1)?;
    
    // Update store's total products count
    ctx.accounts.store.total_products += 1;
    
    Ok(())
}