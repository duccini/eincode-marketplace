import { Nft } from "@/types/nft";
import { CryptoHookFactory } from "@/types/hooks";
import useSWR from "swr";
import { ethers } from "ethers";
import { useCallback } from "react";

type UseListedNftsResponse = {
  buyNft: (token: number, value: number) => Promise<void>;
};

type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>;

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>;

export const hookFactory: ListedNftsHookFactory =
  ({ contract }) =>
  () => {
    const { data, ...swr } = useSWR(
      contract ? "useListedNfts" : null,
      async () => {
        const nfts = [] as Nft[];
        const coreNfts = await contract!.getAllNftsOnSale();

        for (let i = 0; i < coreNfts.length; i++) {
          const item = coreNfts[i];
          const tokenURI = await contract!.tokenURI(item.tokenId);

          console.log(i, tokenURI);

          const metaRes = await fetch(tokenURI);
          const meta = await metaRes.json();

          nfts.push({
            price: parseFloat(ethers.utils.formatEther(item.price)),
            tokenId: item.tokenId.toNumber(),
            creator: item.creator,
            isListed: item.isListed,
            meta,
          });
        }

        return nfts;
      }
    );

    const _contract = contract;
    const buyNft = useCallback(
      async (tokenId: number, value: number) => {
        try {
          const result = await _contract!.buyNft(tokenId, {
            value: ethers.utils.parseEther(value.toString()),
          });

          await result?.wait();

          alert("You have bought NFT. See profile page.");
        } catch (e: any) {
          console.log(e.message);
        }
      },
      [_contract]
    );

    return {
      ...swr,
      buyNft,
      data: data || [],
    };
  };
