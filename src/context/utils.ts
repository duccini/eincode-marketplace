import { setupHooks, Web3Hooks } from "@/hooks/setup";
import { Web3Dependencies } from "@/types/hooks";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, ethers, providers } from "ethers";

// Fazendo window reconhecer ethereum
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

// Nullable type in TypeScript
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Definição dos tipos Web3Params e Web3State
export type Web3State = {
  isLoading: boolean;
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

// Function that creates the default state
export const createDefaultState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({} as any),
  };
};

// Function tha creates the State
export const createWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: Web3Dependencies & { isLoading: boolean }) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract }),
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject("Network ID is not defined!");
  }

  const res = await fetch(`/contracts/${name}.json`);
  const Artifact = await res.json(); // contract json

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    );

    return contract;
  } else {
    return Promise.reject(`Contract: [${name}] can not be loaded.`);
  }
};
