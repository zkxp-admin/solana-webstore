use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(
	owner: Pubkey,
	product_id: u64,
)]
pub struct PurchaseProduct<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		mut,
		seeds = [
			b"store",
			owner.as_ref(),
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

	#[account(
		init,
		space=89,
		payer=fee_payer,
		seeds = [
			b"purchase",
			buyer.key().as_ref(),
			product.key().as_ref(),
		],
		bump,
	)]
	pub purchase: Account<'info, PurchaseAccount>,

	pub buyer: Signer<'info>,

	#[account(
		mut,
	)]
	/// CHECK: implement manual checks if needed
	pub buyer_token_account: UncheckedAccount<'info>,

	#[account(
		mut,
	)]
	/// CHECK: implement manual checks if needed
	pub store_token_account: UncheckedAccount<'info>,

	pub system_program: Program<'info, System>,

	#[account(
		mut,
	)]
	/// CHECK: implement manual checks if needed
	pub source: UncheckedAccount<'info>,

	#[account(
		mut,
	)]
	/// CHECK: implement manual checks if needed
	pub destination: UncheckedAccount<'info>,

	#[account(
		owner=Pubkey::from_str("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA").unwrap(),
	)]
	pub authority: Signer<'info>,

	pub token_program: Program<'info, Token>,
}

impl<'info> PurchaseProduct<'info> {
	pub fn cpi_token_transfer(&self, amount: u64) -> Result<()> {
		anchor_spl::token::transfer(
			CpiContext::new(self.token_program.to_account_info(), 
				anchor_spl::token::Transfer {
					from: self.source.to_account_info(),
					to: self.destination.to_account_info(),
					authority: self.authority.to_account_info()
				}
			),
			amount, 
		)
	}
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
pub fn handler(
	ctx: Context<PurchaseProduct>,
	owner: Pubkey,
	product_id: u64,
) -> Result<()> {
    // Validate that the store is active
    if !ctx.accounts.store.is_active {
        return Err(WebstoreError::StoreNotActive.into());
    }
    
    // Validate that the product is active
    if !ctx.accounts.product.is_active {
        return Err(WebstoreError::ProductNotActive.into());
    }
    
    // Validate that there is sufficient stock
    if ctx.accounts.product.stock == 0 {
        return Err(WebstoreError::InsufficientStock.into());
    }
    
    // Validate that the product ID matches
    if ctx.accounts.product.product_id != product_id {
        return Err(WebstoreError::ProductNotFound.into());
    }
    
    // Transfer tokens from buyer to store
    ctx.accounts.cpi_token_transfer(ctx.accounts.product.price)?;
    
    // Update product stock
    ctx.accounts.product.stock -= 1;
    
    // Create purchase record
    let purchase = &mut ctx.accounts.purchase;
    purchase.buyer = ctx.accounts.buyer.key();
    purchase.product = ctx.accounts.product.key();
    purchase.amount = ctx.accounts.product.price;
    purchase.timestamp = Clock::get()?.unix_timestamp;
    purchase.bump = ctx.bumps.purchase;
    
    Ok(())
}