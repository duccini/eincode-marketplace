import { MetaMaskInpageProvider } from "@metamask/providers";
import { Contract, providers } from "ethers";
import { SWRResponse } from "swr";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: Contract;
  ethereum: MetaMaskInpageProvider;
};

// Why <T> is D (deps) and not P (params)?
export type CryptoSWRResponse<D = any> = SWRResponse<D>;

/**
 *  CryptoSWRHook recebe D from hookFactory, P is the params defined in the func.
 *
 *  <D = any, P = any> Generic types for making hook reuseble
 */
export type CryptoSWRHook<D = any, P = any> = (
  params: P
) => CryptoSWRResponse<D>;

/**
 *  Partial<T> é um utilitário TS que transforma todos os campos de um tipo
 *  T em opcionais
 *  d can be potencial null
 *
 *  Web3Dependencies is the types for deps
 *
 *  CryptoSWRHook is the type that hookFactory returns
 */
export type CryptoHookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoSWRHook<D, P>;
};
