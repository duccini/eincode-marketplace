import { MetaMaskInpageProvider } from "@metamask/providers";
import { providers } from "ethers";
import { SWRResponse } from "swr";
import { NftMarketContract } from "./nftMarketContract";

export type Web3Dependencies = {
  provider: providers.Web3Provider;
  contract: NftMarketContract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

// Why <T> is D (deps) and not P (params)?
export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R;

/**
 *  CryptoSWRHook recebe D from hookFactory, P is the params defined in the func.
 *
 *  <D = any, P = any> Generic types for making hook reuseble
 */
export type CryptoSWRHook<D = any, R = any, P = any> = (
  params?: P
) => CryptoSWRResponse<D, R>;

/**
 *  Partial<T> é um utilitário TS que transforma todos os campos de um tipo
 *  T em opcionais
 *  d can be potencial null
 *
 *  Web3Dependencies is the types for deps
 *
 *  CryptoSWRHook is the type that hookFactory returns
 */
export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoSWRHook<D, R, P>;
};
