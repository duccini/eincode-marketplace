import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
};

// export type CryptoSWRResponse = SWRResponsess

export type CryptoHook = (params: string) => SWRResponse;

// Partial<T> é um utilitário TS que transforma todos os campos de um tipo
// T em opcionais
export type CryptoHookFactory = {
  (d: Partial<Web3Dependencies>): CryptoHook;
};
