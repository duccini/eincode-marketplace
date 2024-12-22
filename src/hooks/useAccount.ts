import { CryptoHookFactory } from "@/types/hooks";
import useSWR from "swr";

// hookFactory é uma HOCF, i.e., que retorna uma função
export const hookFactory: CryptoHookFactory = (deps) => (params) => {
  const swrRes = useSWR("useAccount", () => {
    console.log(deps);
    console.log(params);
    return "Test User";
  });

  return swrRes;
};

// Hook
export const useAccount = hookFactory({
  ethereum: undefined,
  provider: undefined,
});
