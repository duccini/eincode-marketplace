"use client";

import { useListedNfts } from "@/hooks";
import NftItem from "../Item";

const NftList = () => {
  const { nfts } = useListedNfts();

  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.data?.map((nft) => (
        <div
          key={nft.meta.image}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden"
        >
          <NftItem item={nft} buyNft={nfts.buyNft} />
        </div>
      ))}
    </div>
  );
};

export default NftList;
