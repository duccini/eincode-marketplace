type AttributeType = {
  trait_type: "attack" | "health" | "speed";
  value: string;
};

export type NftProps = {
  description: string;
  image: string;
  name: string;
  attributes: AttributeType[];
};

export interface NftsListProps {
  nfts: Nft[];
}

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean;
};

export type Nft = {
  meta: NftProps;
} & NftCore;
