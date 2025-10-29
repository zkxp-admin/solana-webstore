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
	name: Option<String>,
	description: Option<String>,
	price: Option<u64>,
	stock: Option<u64>,
	is_active: Option<bool>,
)]
pub struct UpdateProduct<'info> {
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
		mut,
		seeds = [
			b"product",
			store.key().as_ref(),
			product_id.to_le_bytes().as_ref(),
		],
		bump,
	)]
	pub product: Account<'info, ProductAccount>,

	pub owner: Signer<'info>,
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
pub fn handler(
	ctx: Context<UpdateProduct>,
	product_id: u64,
	name: Option<String>,
	description: Option<String>,
	price: Option<u64>,
	stock: Option<u64>,
	is_active: Option<bool>,
) -> Result<()> {
    // Validate that the product exists
    if ctx.accounts.product.product_id != product_id {
        return Err(WebstoreError::ProductNotFound.into());
    }
    
    // Update product fields conditionally
    if let Some(name) = name {
        ctx.accounts.product.name = name;
    }
    
    if let Some(description) = description {
        ctx.accounts.product.description = description;
    }
    
    if let Some(price) = price {
        ctx.accounts.product.price = price;
    }
    
    if let Some(stock) = stock {
        ctx.accounts.product.stock = stock;
    }
    
    if let Some(is_active) = is_active {
        ctx.accounts.product.is_active = is_active;
    }
    
    Ok(())
}