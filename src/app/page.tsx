"use client";

import NftList from "@/components/Nft/List";

import nfts from "../../data/meta.json";
import { NftProps } from "@/components/Nft/nft.model";
import { useWeb3 } from "@/hooks/useWeb3";

export default function Home() {
  const { provider } = useWeb3();

  const getAccounts = async () => {
    const accounts = await provider!.listAccounts();
    console.log(accounts[0]);
  };

  if (provider) {
    getAccounts();
  }

  return (
    <div className="relative bg-gray-100 pt-16 pb-20 px-4 sm:px-6 lg:pt-12 lg:pb-12 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative">
        <div className="text-center">
          <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
            Amazing Creatures NFTs
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Mint a NFT to get unlimited ownership forever!
          </p>
        </div>

        <NftList nfts={nfts as NftProps[]} />
      </div>
    </div>
  );
}
