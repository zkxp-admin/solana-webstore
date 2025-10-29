import {PublicKey} from "@solana/web3.js";
import BN from "bn.js";

export type StoreSeeds = {
    owner: PublicKey, 
};

export const deriveStorePDA = (
    seeds: StoreSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("store"),
            seeds.owner.toBuffer(),
        ],
        programId,
    )
};

export type ProductSeeds = {
    store: PublicKey, 
    productId: bigint, 
};

export const deriveProductPDA = (
    seeds: ProductSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("product"),
            seeds.store.toBuffer(),
            Buffer.from(Buffer.from(new BN(seeds.productId.toString()).toArray("le", 8))),
        ],
        programId,
    )
};

export type PurchaseSeeds = {
    buyer: PublicKey, 
    product: PublicKey, 
};

export const derivePurchasePDA = (
    seeds: PurchaseSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("purchase"),
            seeds.buyer.toBuffer(),
            seeds.product.toBuffer(),
        ],
        programId,
    )
};

export type NftMetadataSeeds = {
    mint: PublicKey, 
};

export const deriveNftMetadataPDA = (
    seeds: NftMetadataSeeds,
    programId: PublicKey
): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            seeds.mint.toBuffer(),
        ],
        programId,
    )
};

export module TokenProgramPDAs {
    export type AccountSeeds = {
        wallet: PublicKey, 
        tokenProgram: PublicKey, 
        mint: PublicKey, 
    };
    
    export const deriveAccountPDA = (
        seeds: AccountSeeds,
        programId: PublicKey
    ): [PublicKey, number] => {
        return PublicKey.findProgramAddressSync(
            [
                seeds.wallet.toBuffer(),
                seeds.tokenProgram.toBuffer(),
                seeds.mint.toBuffer(),
            ],
            programId,
        )
    };
    
}

export module AssociatedTokenProgramPDAs {
    export module TokenProgramPDAs {
        export type AccountSeeds = {
            wallet: PublicKey, 
            tokenProgram: PublicKey, 
            mint: PublicKey, 
        };
        
        export const deriveAccountPDA = (
            seeds: AccountSeeds,
            programId: PublicKey
        ): [PublicKey, number] => {
            return PublicKey.findProgramAddressSync(
                [
                    seeds.wallet.toBuffer(),
                    seeds.tokenProgram.toBuffer(),
                    seeds.mint.toBuffer(),
                ],
                programId,
            )
        };
        
    }
    
}

