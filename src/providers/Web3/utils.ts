import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";

// Fazendo window reconhecer ethereum
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

// Definição dos tipos Web3Params e Web3State
export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  provider: providers.Web3Provider | null;
  contract: Contract | null;
};

export type Web3State = {
  isLoading: boolean;
} & Web3Params;

// Função que retorna o estado padrão
export const createDefaultState = (): Web3State => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
  };
};
