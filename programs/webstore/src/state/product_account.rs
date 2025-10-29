
use anchor_lang::prelude::*;

#[account]
pub struct ProductAccount {
	pub store: Pubkey,
	pub product_id: u64,
	pub name: String,
	pub description: String,
	pub price: u64,
	pub stock: u64,
	pub is_active: bool,
	pub metadata_mint: Option<Pubkey>,
	pub bump: u8,
}
