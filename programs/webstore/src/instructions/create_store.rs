use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
#[instruction(
	name: String,
	description: String,
)]
pub struct CreateStore<'info> {
	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,

	#[account(
		init,
		space=634,
		payer=fee_payer,
		seeds = [
			b"store",
			owner.key().as_ref(),
		],
		bump,
	)]
	pub store: Account<'info, StoreAccount>,

	pub owner: Signer<'info>,

	pub system_program: Program<'info, System>,
}

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
pub fn handler(
	ctx: Context<CreateStore>,
	name: String,
	description: String,
) -> Result<()> {
    let store = &mut ctx.accounts.store;
    store.owner = ctx.accounts.owner.key();
    store.name = name;
    store.description = description;
    store.is_active = true;
    store.total_products = 0;
    store.bump = ctx.bumps.store;
    
    Ok(())
}