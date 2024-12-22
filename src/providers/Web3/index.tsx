"use client";

import { createContext, useEffect, useState } from "react";
import { createDefaultState, Web3State } from "./utils";
import { ethers } from "ethers";

// Criando o Contexto
export const Web3Context = createContext<Web3State>(createDefaultState());

type Web3ProviderProps = {
  children: React.ReactElement;
};

// Componente do Provider
const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState());

  useEffect(() => {
    function initWeb3() {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      setWeb3Api({
        ethereum: window.ethereum,
        provider,
        contract: null,
        isLoading: false,
      });
    }

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export default Web3Provider;
