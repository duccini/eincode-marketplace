import useSWR from "swr";
import { CryptoHookFactory } from "@/types/hooks";

const NETWORKS: { [k: string]: string } = {
  1: "Ethereum Main Network",
  56: "Binance Smart Chain",
  97: "BNB Smart Chain Testnet",
  137: "Polygon Mainnet",
  1337: "Ganache",
  80002: "Polygon Amoy Testnet",
  11155111: "Sepolia Test Network",
};

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type UseNetworkResponse = {
  isLoading: boolean | undefined;
  isSupported: boolean;
  targetNetwork: string;
};

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseNetworkHook = ReturnType<NetworkHookFactory>;

export const hookFactory: NetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...rest } = useSWR(
      provider ? "useNetwork" : null,
      async () => {
        const chainId = (await provider!.getNetwork()).chainId;

        if (!chainId) {
          throw "Cannot retrieve network. Please, connect to other one.";
        } else {
          return NETWORKS[chainId];
        }
      },
      {
        revalidateOnFocus: false,
      }
    );

    return {
      data,
      isValidating,
      targetNetwork,
      isSupported: data === targetNetwork,
      isLoading: isLoading,
      ...rest,
    };
  };
