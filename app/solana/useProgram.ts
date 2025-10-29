import { AnchorProvider } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  type AccountMeta,
  type TransactionInstruction,
  type TransactionSignature,
} from "@solana/web3.js";
import { useCallback, useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import * as programClient from "~/solana/client";

// Props interface for the useProgram hook
export interface UseProgramProps {
  // Optional override for the VITE_SOLANA_PROGRAM_ID env var
  programId?: string;
}

// Error structure returned from sendAndConfirmTx if transaction fails
type SendAndConfirmTxError = {
  message: string;
  logs: string[];
  stack: string | undefined;
};

// Result structure returned from sendAndConfirmTx
type SendAndConfirmTxResult = {
  // Signature of successful transaction
  signature?: string;

  // Error details if transaction fails
  error?: SendAndConfirmTxError;
};

// Helper function to send and confirm a transaction, with error handling
const sendAndConfirmTx = async (
  fn: () => Promise<TransactionSignature>,
): Promise<SendAndConfirmTxResult> => {
  try {
    const signature = await fn();
    return {
      signature,
    };
  } catch (e: any) {
    let message = `An unknown error occurred: ${e}`;
    let logs = [];
    let stack = "";

    if ("logs" in e && e.logs instanceof Array) {
      logs = e.logs;
    }

    if ("stack" in e) {
      stack = e.stack;
    }

    if ("message" in e) {
      message = e.message;
    }

    return {
      error: {
        logs,
        stack,
        message,
      },
    };
  }
};

const useProgram = (props?: UseProgramProps | undefined) => {
  const [programId, setProgramId] = useState<PublicKey|undefined>(undefined)
  const { connection } = useConnection();

  useEffect(() => {
    let prgId = import.meta.env.VITE_SOLANA_PROGRAM_ID as string | undefined;

    if (props?.programId) {
      prgId = props.programId;
    }

    if (!prgId) {
      throw new Error(
        "the program id must be provided either by the useProgram props or the env var VITE_SOLANA_PROGRAM_ID",
      );
    }

    const pid = new PublicKey(prgId)
    setProgramId(pid)
    programClient.initializeClient(pid, new AnchorProvider(connection));
  }, [props?.programId, connection.rpcEndpoint]);

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const createStore = useCallback(programClient.createStore, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const createStoreSendAndConfirm = useCallback(async (
    args: Omit<programClient.CreateStoreArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.createStoreSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const updateStoreConfig = useCallback(programClient.updateStoreConfig, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const updateStoreConfigSendAndConfirm = useCallback(async (
    args: Omit<programClient.UpdateStoreConfigArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.updateStoreConfigSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const createProduct = useCallback(programClient.createProduct, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const createProductSendAndConfirm = useCallback(async (
    args: Omit<programClient.CreateProductArgs, "feePayer" | "owner" | "mint" | "funding"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
        mint: Keypair,
        funding: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.createProductSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const updateProduct = useCallback(programClient.updateProduct, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const updateProductSendAndConfirm = useCallback(async (
    args: Omit<programClient.UpdateProductArgs, "feePayer" | "owner"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.updateProductSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const purchaseProduct = useCallback(programClient.purchaseProduct, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const purchaseProductSendAndConfirm = useCallback(async (
    args: Omit<programClient.PurchaseProductArgs, "feePayer" | "buyer" | "authority"> & {
    signers: {
        feePayer: Keypair,
        buyer: Keypair,
        authority: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.purchaseProductSendAndConfirm(args, remainingAccounts)), [])

  /**
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
   *
   * @returns {@link TransactionInstruction}
   */
  const verifyLicense = useCallback(programClient.verifyLicense, [])

  /**
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
   *
   * @returns {@link SendAndConfirmTxResult}
   */
  const verifyLicenseSendAndConfirm = useCallback(async (
    args: Omit<programClient.VerifyLicenseArgs, "feePayer" | "owner" | "authority"> & {
    signers: {
        feePayer: Keypair,
        owner: Keypair,
        authority: Keypair,
    }}, 
    remainingAccounts: Array<AccountMeta> = []
  ): Promise<SendAndConfirmTxResult> => sendAndConfirmTx(() => programClient.verifyLicenseSendAndConfirm(args, remainingAccounts)), [])


  const getStoreAccount = useCallback(programClient.getStoreAccount, [])
  const getProductAccount = useCallback(programClient.getProductAccount, [])
  const getPurchaseAccount = useCallback(programClient.getPurchaseAccount, [])
  const getNftMetadataAccount = useCallback(programClient.getNftMetadataAccount, [])

  const deriveStore = useCallback(programClient.deriveStorePDA,[])
  const deriveProduct = useCallback(programClient.deriveProductPDA,[])
  const derivePurchase = useCallback(programClient.derivePurchasePDA,[])
  const deriveNftMetadata = useCallback(programClient.deriveNftMetadataPDA,[])
  const deriveAccountFromTokenProgram = useCallback(programClient.TokenProgramPDAs.deriveAccountPDA, [])

  return {
	programId,
    createStore,
    createStoreSendAndConfirm,
    updateStoreConfig,
    updateStoreConfigSendAndConfirm,
    createProduct,
    createProductSendAndConfirm,
    updateProduct,
    updateProductSendAndConfirm,
    purchaseProduct,
    purchaseProductSendAndConfirm,
    verifyLicense,
    verifyLicenseSendAndConfirm,
    getStoreAccount,
    getProductAccount,
    getPurchaseAccount,
    getNftMetadataAccount,
    deriveStore,
    deriveProduct,
    derivePurchase,
    deriveNftMetadata,
    deriveAccountFromTokenProgram,
  };
};

export { useProgram };