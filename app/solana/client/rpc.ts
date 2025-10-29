import BN from "bn.js";
import {
  AnchorProvider,
  type IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import type { Webstore } from "../../../target/types/webstore";
import idl from "../../../target/idl/webstore.json";
import * as pda from "./pda";



let _program: Program<Webstore>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<Webstore>(
        idl as Webstore,
        anchorProvider,
    );


};

export type CreateStoreArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  name: string;
  description: string;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new store with initial configuration
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to be created
 * 2. `[signer]` owner: {@link PublicKey} Store owner account
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Store name
 * - description: {@link string} type
 */
export const createStoreBuilder = (
	args: CreateStoreArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Webstore, never> => {
    const [storePubkey] = pda.deriveStorePDA({
        owner: args.owner,
    }, _program.programId);

  return _program
    .methods
    .createStore(
      args.name,
      args.description,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      store: storePubkey,
      owner: args.owner,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new store with initial configuration
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to be created
 * 2. `[signer]` owner: {@link PublicKey} Store owner account
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Store name
 * - description: {@link string} type
 */
export const createStore = (
	args: CreateStoreArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createStoreBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new store with initial configuration
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to be created
 * 2. `[signer]` owner: {@link PublicKey} Store owner account
 * 3. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - name: {@link string} Store name
 * - description: {@link string} type
 */
export const createStoreSendAndConfirm = async (
  args: Omit<CreateStoreArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createStoreBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type UpdateStoreConfigArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  name: string | undefined;
  description: string | undefined;
  isActive: boolean | undefined;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update store configuration
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to update
 * 2. `[signer]` owner: {@link PublicKey} Store owner account
 *
 * Data:
 * - name: {@link string | undefined} New store name (optional)
 * - description: {@link string | undefined} type
 * - is_active: {@link boolean | undefined} New active status (optional)
 */
export const updateStoreConfigBuilder = (
	args: UpdateStoreConfigArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Webstore, never> => {
    const [storePubkey] = pda.deriveStorePDA({
        owner: args.owner,
    }, _program.programId);

  return _program
    .methods
    .updateStoreConfig(
      args.name,
      args.description,
      args.isActive,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      store: storePubkey,
      owner: args.owner,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update store configuration
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to update
 * 2. `[signer]` owner: {@link PublicKey} Store owner account
 *
 * Data:
 * - name: {@link string | undefined} New store name (optional)
 * - description: {@link string | undefined} type
 * - is_active: {@link boolean | undefined} New active status (optional)
 */
export const updateStoreConfig = (
	args: UpdateStoreConfigArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateStoreConfigBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update store configuration
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to update
 * 2. `[signer]` owner: {@link PublicKey} Store owner account
 *
 * Data:
 * - name: {@link string | undefined} New store name (optional)
 * - description: {@link string | undefined} type
 * - is_active: {@link boolean | undefined} New active status (optional)
 */
export const updateStoreConfigSendAndConfirm = async (
  args: Omit<UpdateStoreConfigArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateStoreConfigBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type CreateProductArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  mint: web3.PublicKey;
  funding: web3.PublicKey;
  wallet: web3.PublicKey;
  productId: bigint;
  name: string;
  description: string;
  price: bigint;
  stock: bigint;
  isActive: boolean;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new product listing
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to add product to
 * 2. `[writable]` product: {@link ProductAccount} Product account to be created
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 * 4. `[writable, signer]` mint: {@link Mint} Mint account for NFT (if applicable)
 * 5. `[writable]` metadata: {@link NftMetadataAccount} NFT metadata account
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 7. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 8. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 9. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 10. `[]` token_program: {@link PublicKey} SPL Token program
 * 11. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 * 12. `[]` associated_token_program: {@link PublicKey} Auto-generated, AssociatedTokenProgram
 *
 * Data:
 * - product_id: {@link BigInt} Unique product identifier
 * - name: {@link string} Product name
 * - description: {@link string} type
 * - price: {@link BigInt} Product price in lamports
 * - stock: {@link BigInt} Available stock quantity
 * - is_active: {@link boolean} Whether product is available for purchase
 */
export const createProductBuilder = (
	args: CreateProductArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Webstore, never> => {
    const [storePubkey] = pda.deriveStorePDA({
        owner: args.owner,
    }, _program.programId);
    const [productPubkey] = pda.deriveProductPDA({
        store: args.store,
        productId: args.productId,
    }, _program.programId);
    const [metadataPubkey] = pda.deriveNftMetadataPDA({
        mint: args.mint,
    }, _program.programId);
    const [assocTokenAccountPubkey] = pda.CslSplTokenPDAs.deriveAccountPDA({
        wallet: args.wallet,
        tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        mint: args.mint,
    }, new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"));

  return _program
    .methods
    .createProduct(
      new BN(args.productId.toString()),
      args.name,
      args.description,
      new BN(args.price.toString()),
      new BN(args.stock.toString()),
      args.isActive,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      store: storePubkey,
      product: productPubkey,
      owner: args.owner,
      mint: args.mint,
      metadata: metadataPubkey,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
      funding: args.funding,
      assocTokenAccount: assocTokenAccountPubkey,
      wallet: args.wallet,
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      associatedTokenProgram: new web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new product listing
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to add product to
 * 2. `[writable]` product: {@link ProductAccount} Product account to be created
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 * 4. `[writable, signer]` mint: {@link Mint} Mint account for NFT (if applicable)
 * 5. `[writable]` metadata: {@link NftMetadataAccount} NFT metadata account
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 7. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 8. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 9. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 10. `[]` token_program: {@link PublicKey} SPL Token program
 * 11. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 * 12. `[]` associated_token_program: {@link PublicKey} Auto-generated, AssociatedTokenProgram
 *
 * Data:
 * - product_id: {@link BigInt} Unique product identifier
 * - name: {@link string} Product name
 * - description: {@link string} type
 * - price: {@link BigInt} Product price in lamports
 * - stock: {@link BigInt} Available stock quantity
 * - is_active: {@link boolean} Whether product is available for purchase
 */
export const createProduct = (
	args: CreateProductArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createProductBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new product listing
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account to add product to
 * 2. `[writable]` product: {@link ProductAccount} Product account to be created
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 * 4. `[writable, signer]` mint: {@link Mint} Mint account for NFT (if applicable)
 * 5. `[writable]` metadata: {@link NftMetadataAccount} NFT metadata account
 * 6. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 7. `[writable, signer]` funding: {@link PublicKey} Funding account (must be a system account)
 * 8. `[writable]` assoc_token_account: {@link PublicKey} Associated token account address to be created
 * 9. `[]` wallet: {@link PublicKey} Wallet address for the new associated token account
 * 10. `[]` token_program: {@link PublicKey} SPL Token program
 * 11. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 * 12. `[]` associated_token_program: {@link PublicKey} Auto-generated, AssociatedTokenProgram
 *
 * Data:
 * - product_id: {@link BigInt} Unique product identifier
 * - name: {@link string} Product name
 * - description: {@link string} type
 * - price: {@link BigInt} Product price in lamports
 * - stock: {@link BigInt} Available stock quantity
 * - is_active: {@link boolean} Whether product is available for purchase
 */
export const createProductSendAndConfirm = async (
  args: Omit<CreateProductArgs, "feePayer" | "owner" | "mint" | "funding"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
      mint: web3.Signer,
      funding: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createProductBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
      mint: args.signers.mint.publicKey,
      funding: args.signers.funding.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner, args.signers.mint, args.signers.funding])
    .rpc();
}

export type UpdateProductArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  productId: bigint;
  name: string | undefined;
  description: string | undefined;
  price: bigint | undefined;
  stock: bigint | undefined;
  isActive: boolean | undefined;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update product information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account containing product
 * 2. `[writable]` product: {@link ProductAccount} Product account to update
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 *
 * Data:
 * - product_id: {@link BigInt} Product identifier
 * - name: {@link string | undefined} New product name (optional)
 * - description: {@link string | undefined} type
 * - price: {@link BigInt | undefined} New product price (optional)
 * - stock: {@link BigInt | undefined} New stock quantity (optional)
 * - is_active: {@link boolean | undefined} New active status (optional)
 */
export const updateProductBuilder = (
	args: UpdateProductArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Webstore, never> => {
    const [storePubkey] = pda.deriveStorePDA({
        owner: args.owner,
    }, _program.programId);
    const [productPubkey] = pda.deriveProductPDA({
        store: args.store,
        productId: args.productId,
    }, _program.programId);

  return _program
    .methods
    .updateProduct(
      new BN(args.productId.toString()),
      args.name,
      args.description,
      args.price ? new BN(args.price.toString()) : undefined,
      args.stock ? new BN(args.stock.toString()) : undefined,
      args.isActive,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      store: storePubkey,
      product: productPubkey,
      owner: args.owner,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update product information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account containing product
 * 2. `[writable]` product: {@link ProductAccount} Product account to update
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 *
 * Data:
 * - product_id: {@link BigInt} Product identifier
 * - name: {@link string | undefined} New product name (optional)
 * - description: {@link string | undefined} type
 * - price: {@link BigInt | undefined} New product price (optional)
 * - stock: {@link BigInt | undefined} New stock quantity (optional)
 * - is_active: {@link boolean | undefined} New active status (optional)
 */
export const updateProduct = (
	args: UpdateProductArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateProductBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update product information
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account containing product
 * 2. `[writable]` product: {@link ProductAccount} Product account to update
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 *
 * Data:
 * - product_id: {@link BigInt} Product identifier
 * - name: {@link string | undefined} New product name (optional)
 * - description: {@link string | undefined} type
 * - price: {@link BigInt | undefined} New product price (optional)
 * - stock: {@link BigInt | undefined} New stock quantity (optional)
 * - is_active: {@link boolean | undefined} New active status (optional)
 */
export const updateProductSendAndConfirm = async (
  args: Omit<UpdateProductArgs, "feePayer" | "owner"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateProductBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner])
    .rpc();
}

export type PurchaseProductArgs = {
  feePayer: web3.PublicKey;
  buyer: web3.PublicKey;
  buyerTokenAccount: web3.PublicKey;
  storeTokenAccount: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  owner: web3.PublicKey;
  productId: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Purchase a product from the store
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account
 * 2. `[writable]` product: {@link ProductAccount} Product account to purchase
 * 3. `[writable]` purchase: {@link PurchaseAccount} Purchase record account
 * 4. `[signer]` buyer: {@link PublicKey} Buyer account
 * 5. `[writable]` buyer_token_account: {@link PublicKey} Buyer's token account
 * 6. `[writable]` store_token_account: {@link PublicKey} Store's token account
 * 7. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 8. `[writable]` source: {@link PublicKey} The source account.
 * 9. `[writable]` destination: {@link PublicKey} The destination account.
 * 10. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 11. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - owner: {@link PublicKey} Store owner for PDA derivation
 * - product_id: {@link BigInt} Product identifier
 */
export const purchaseProductBuilder = (
	args: PurchaseProductArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Webstore, never> => {
    const [storePubkey] = pda.deriveStorePDA({
        owner: args.owner,
    }, _program.programId);
    const [productPubkey] = pda.deriveProductPDA({
        store: args.store,
        productId: args.productId,
    }, _program.programId);
    const [purchasePubkey] = pda.derivePurchasePDA({
        buyer: args.buyer,
        product: args.product,
    }, _program.programId);

  return _program
    .methods
    .purchaseProduct(
      args.owner,
      new BN(args.productId.toString()),
    )
    .accountsStrict({
      feePayer: args.feePayer,
      store: storePubkey,
      product: productPubkey,
      purchase: purchasePubkey,
      buyer: args.buyer,
      buyerTokenAccount: args.buyerTokenAccount,
      storeTokenAccount: args.storeTokenAccount,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Purchase a product from the store
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account
 * 2. `[writable]` product: {@link ProductAccount} Product account to purchase
 * 3. `[writable]` purchase: {@link PurchaseAccount} Purchase record account
 * 4. `[signer]` buyer: {@link PublicKey} Buyer account
 * 5. `[writable]` buyer_token_account: {@link PublicKey} Buyer's token account
 * 6. `[writable]` store_token_account: {@link PublicKey} Store's token account
 * 7. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 8. `[writable]` source: {@link PublicKey} The source account.
 * 9. `[writable]` destination: {@link PublicKey} The destination account.
 * 10. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 11. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - owner: {@link PublicKey} Store owner for PDA derivation
 * - product_id: {@link BigInt} Product identifier
 */
export const purchaseProduct = (
	args: PurchaseProductArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    purchaseProductBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Purchase a product from the store
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account
 * 2. `[writable]` product: {@link ProductAccount} Product account to purchase
 * 3. `[writable]` purchase: {@link PurchaseAccount} Purchase record account
 * 4. `[signer]` buyer: {@link PublicKey} Buyer account
 * 5. `[writable]` buyer_token_account: {@link PublicKey} Buyer's token account
 * 6. `[writable]` store_token_account: {@link PublicKey} Store's token account
 * 7. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 * 8. `[writable]` source: {@link PublicKey} The source account.
 * 9. `[writable]` destination: {@link PublicKey} The destination account.
 * 10. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 11. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - owner: {@link PublicKey} Store owner for PDA derivation
 * - product_id: {@link BigInt} Product identifier
 */
export const purchaseProductSendAndConfirm = async (
  args: Omit<PurchaseProductArgs, "feePayer" | "buyer" | "authority"> & {
    signers: {
      feePayer: web3.Signer,
      buyer: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return purchaseProductBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      buyer: args.signers.buyer.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.buyer, args.signers.authority])
    .rpc();
}

export type VerifyLicenseArgs = {
  feePayer: web3.PublicKey;
  owner: web3.PublicKey;
  source: web3.PublicKey;
  destination: web3.PublicKey;
  authority: web3.PublicKey;
  productId: bigint;
  buyer: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Verify product license (for NFT products)
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account
 * 2. `[writable]` product: {@link ProductAccount} Product account
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - product_id: {@link BigInt} Product identifier
 * - buyer: {@link PublicKey} Buyer account to verify license for
 */
export const verifyLicenseBuilder = (
	args: VerifyLicenseArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<Webstore, never> => {
    const [storePubkey] = pda.deriveStorePDA({
        owner: args.owner,
    }, _program.programId);
    const [productPubkey] = pda.deriveProductPDA({
        store: args.store,
        productId: args.productId,
    }, _program.programId);

  return _program
    .methods
    .verifyLicense(
      new BN(args.productId.toString()),
      args.buyer,
    )
    .accountsStrict({
      feePayer: args.feePayer,
      store: storePubkey,
      product: productPubkey,
      owner: args.owner,
      source: args.source,
      destination: args.destination,
      authority: args.authority,
      tokenProgram: new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Verify product license (for NFT products)
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account
 * 2. `[writable]` product: {@link ProductAccount} Product account
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - product_id: {@link BigInt} Product identifier
 * - buyer: {@link PublicKey} Buyer account to verify license for
 */
export const verifyLicense = (
	args: VerifyLicenseArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    verifyLicenseBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Verify product license (for NFT products)
 *
 * Accounts:
 * 0. `[writable, signer]` fee_payer: {@link PublicKey} 
 * 1. `[writable]` store: {@link StoreAccount} Store account
 * 2. `[writable]` product: {@link ProductAccount} Product account
 * 3. `[signer]` owner: {@link PublicKey} Store owner account
 * 4. `[writable]` source: {@link PublicKey} The source account.
 * 5. `[writable]` destination: {@link PublicKey} The destination account.
 * 6. `[signer]` authority: {@link PublicKey} The source account's owner/delegate.
 * 7. `[]` token_program: {@link PublicKey} Auto-generated, TokenProgram
 *
 * Data:
 * - product_id: {@link BigInt} Product identifier
 * - buyer: {@link PublicKey} Buyer account to verify license for
 */
export const verifyLicenseSendAndConfirm = async (
  args: Omit<VerifyLicenseArgs, "feePayer" | "owner" | "authority"> & {
    signers: {
      feePayer: web3.Signer,
      owner: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return verifyLicenseBuilder({
      ...args,
      feePayer: args.signers.feePayer.publicKey,
      owner: args.signers.owner.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.feePayer, args.signers.owner, args.signers.authority])
    .rpc();
}

// Getters

export const getStoreAccount = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Webstore>["storeAccount"]> => _program.account.storeAccount.fetch(publicKey, commitment);

export const getProductAccount = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Webstore>["productAccount"]> => _program.account.productAccount.fetch(publicKey, commitment);

export const getPurchaseAccount = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Webstore>["purchaseAccount"]> => _program.account.purchaseAccount.fetch(publicKey, commitment);

export const getNftMetadataAccount = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<Webstore>["nftMetadataAccount"]> => _program.account.nftMetadataAccount.fetch(publicKey, commitment);
