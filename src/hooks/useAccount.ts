import useSWR from "swr";
import { CryptoHookFactory } from "@/types/hooks";

type AccountHookFactory = CryptoHookFactory<number, string>;

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
 */

export const hookFactory: AccountHookFactory = (deps) => (params) => {
  const swrRes = useSWR("useAccount", () => {
    console.log(deps);
    console.log(params);
    return 123;
  });

  return swrRes;
};

// Hook
export const useAccount = hookFactory({
  ethereum: undefined,
  provider: undefined,
});
