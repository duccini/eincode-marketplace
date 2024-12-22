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
  nfts: NftProps[];
}
