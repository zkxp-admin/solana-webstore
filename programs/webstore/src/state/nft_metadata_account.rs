
use anchor_lang::prelude::*;

#[account]
pub struct NftMetadataAccount {
	pub mint: Pubkey,
	pub name: String,
	pub symbol: String,
	pub uri: String,
	pub is_fungible: bool,
	pub bump: u8,
}
