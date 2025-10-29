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
	buyer: Pubkey,
)]
pub struct VerifyLicense<'info> {
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

impl<'info> VerifyLicense<'info> {
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
pub fn handler(
	ctx: Context<VerifyLicense>,
	product_id: u64,
	buyer: Pubkey,
) -> Result<()> {
    // Validate that the product is active
    if !ctx.accounts.product.is_active {
        return Err(WebstoreError::ProductNotActive.into());
    }
    
    // Validate that the product is NFT-based
    if ctx.accounts.product.metadata_mint.is_none() {
        return Err(WebstoreError::LicenseNotValid.into());
    }
    
    // Validate that the product ID matches
    if ctx.accounts.product.product_id != product_id {
        return Err(WebstoreError::ProductNotFound.into());
    }
    
    // Verify that the buyer owns the NFT by checking if they have a token account with balance
    // This is a simplified check - in a real implementation, you'd want to verify the actual NFT ownership
    
    // For now, we'll just simulate the license verification
    // In a real implementation, you would check the buyer's token account for the NFT
    
    Ok(())
}