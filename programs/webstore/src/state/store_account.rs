
use anchor_lang::prelude::*;

#[account]
pub struct StoreAccount {
	pub owner: Pubkey,
	pub name: String,
	pub description: String,
	pub is_active: bool,
	pub total_products: u64,
	pub bump: u8,
}
