"use client";

import { createContext, useEffect, useState } from "react";
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  Web3State,
} from "./utils";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { NftMarketContract } from "@/types/nftMarketContract";

const pageReload = () => {
  window.location.reload();
};

const handleAccountsChange = (ethereum: MetaMaskInpageProvider) => async () => {
  const isLocked = !(await ethereum._metamask.isUnlocked());
  if (isLocked) {
    pageReload();
  }
};

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on("chainChanged", pageReload);
  ethereum.on("accountsChanged", handleAccountsChange(ethereum));
};

// ethereum is undefined when the browser doesn't have Metamask
const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener("chainChanged", pageReload);
  ethereum?.removeListener("accountsChanged", handleAccountsChange);
};

// Criando o Contexto
export const Web3Context = createContext<Web3State>(createDefaultState());

type Web3ProviderProps = {
  children: React.ReactElement;
};

// Componente do Provider
const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    async function initWeb3() {
      // sensitive code must be wrapped within trycatch
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );

        const contract = await loadContract("NftMarket", provider);

        // Sign Contract
        const signer = provider.getSigner();
        const signedContract = contract.connect(signer);

        // Registering event listener
        setGlobalListeners(window.ethereum);

        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract: signedContract as unknown as NftMarketContract,
            isLoading: false,
          })
        );
      } catch (error: any) {
        console.log("Please, install a web3 wallet");
        setWeb3Api((prevState) =>
          createWeb3State({
            ...(prevState as any),
            isLoading: false,
          })
        );
      }
    }

    initWeb3();

    // Remove event listener
    return () => removeGlobalListeners(window.ethereum);
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export default Web3Provider;
