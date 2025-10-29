use crate::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateStoreConfig<'info> {
	#[account(
		mut,
		seeds = [
			b"store",
			owner.key().as_ref(),
		],
		bump = store.bump,
	)]
	pub store: Account<'info, StoreAccount>,

	pub owner: Signer<'info>,

	#[account(
		mut,
	)]
	pub fee_payer: Signer<'info>,
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
pub fn handler(
	ctx: Context<UpdateStoreConfig>,
	name: Option<String>,
	description: Option<String>,
	is_active: Option<bool>,
) -> Result<()> {
    let store = &mut ctx.accounts.store;
    
    // Check if the owner is the same as the signer
    if store.owner != ctx.accounts.owner.key() {
        return Err(WebstoreError::Unauthorized.into());
    }
    
    // Update fields if provided
    if let Some(name) = name {
        store.name = name;
    }
    
    if let Some(description) = description {
        store.description = description;
    }
    
    if let Some(is_active) = is_active {
        store.is_active = is_active;
    }
    
    Ok(())
}