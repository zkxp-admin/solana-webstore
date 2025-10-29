

use anchor_lang::prelude::*;

#[error_code]
pub enum WebstoreError {
	#[msg("Unauthorized access")]
	Unauthorized,
	#[msg("Store not found")]
	StoreNotFound,
	#[msg("Product not found")]
	ProductNotFound,
	#[msg("Insufficient product stock")]
	InsufficientStock,
	#[msg("Insufficient funds for purchase")]
	InsufficientFunds,
	#[msg("Product is not active")]
	ProductNotActive,
	#[msg("Store is not active")]
	StoreNotActive,
	#[msg("Invalid product ID")]
	InvalidProductId,
	#[msg("License verification failed")]
	LicenseNotValid,
}
