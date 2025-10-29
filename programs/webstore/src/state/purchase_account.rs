
use anchor_lang::prelude::*;

#[account]
pub struct PurchaseAccount {
	pub buyer: Pubkey,
	pub product: Pubkey,
	pub amount: u64,
	pub timestamp: i64,
	pub bump: u8,
}
