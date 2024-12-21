import NftItem from "../Item";
import { NftsListProps } from "../nft.model";

const NftList = ({ nfts }: NftsListProps) => {
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.map((nft) => (
        <div
          key={nft.image}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden"
        >
          <NftItem item={nft} />
        </div>
      ))}
    </div>
  );
};

export default NftList;
