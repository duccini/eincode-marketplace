import { useHooks } from "./useWeb3";

export const useAccount = () => {
  const hooks = useHooks(); // get hooks from Context
  const swrRes = hooks.useAccount(); // get useAccount from hookFactory

  return {
    account: swrRes,
  };
};
