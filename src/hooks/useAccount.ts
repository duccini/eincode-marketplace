import useSWR from "swr";
import { CryptoHookFactory } from "@/types/hooks";
import { useEffect } from "react";

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
};

// params is optional, don't need any type
type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

/**
 *  hookFactory é uma HOF (High Order Function), i.e., uma func. que retorna outra
 *  func. ou que usa uma func. como parâmetro
 *
 *  deps -> provider, ethereum, contract FROM (web3Sate)
 *
 *  useSWR(identifier, function responsible for fetching data)
 *
 *  const useAccount = hookFactory(deps)
 *  const { data, isValidation, error } = useAccount(params)
 *  data, isValidation, error is expose it to us by SWR
 *
 *  isValidating is true whenever you are fetching data
 */

/**
 *  Conditional SWR
 *
 *  the function inside useSWR is called only when we get a proveider
 *  otherwise, undefined is returned
 */

export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const { data, mutate, isValidating, ...rest } = useSWR(
      provider ? "useAccount" : null,
      async () => {
        const accounts = await provider!.listAccounts();

        if (!accounts[0]) {
          throw "Canot retrive account! Please, connect to web3 wallet.";
        }

        return accounts[0];
      },
      {
        revalidateOnFocus: false,
      }
    );

    useEffect(() => {
      ethereum?.on("accountsChanged", handleAccountsChanged);

      return () => {
        ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    });

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        console.error("Please, connect to Web3 wallet");
      } else if (accounts[0] !== data) {
        // swrRes will reavalidate itself
        mutate(accounts[0]);
      }
    };

    const connect = async () => {
      try {
        ethereum?.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
    };

    return {
      data,
      mutate,
      isValidating,
      connect,
      isLoading: isLoading || isValidating,
      isInstalled: ethereum?.isMetaMask || false,
      ...rest,
    };
  };

// Hook
export const useAccount = hookFactory({
  ethereum: undefined,
  provider: undefined,
});
