import { useHooks } from "./useWeb3";

export const useAccount = () => {
  const hooks = useHooks(); // get hooks from Context
  const swrRes = hooks.useAccount(); // get useAccount from hookFactory

  return {
    account: swrRes,
  };
};

export const useNetwork = () => {
  const hooks = useHooks();
  const swrRes = hooks.useNetwork();

  return {
    network: swrRes,
  };
};

export const useListedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useListedNfts();

  return {
    nfts: swrRes,
  };
};

export const useOwnedNfts = () => {
  const hooks = useHooks();
  const swrRes = hooks.useOwnedNfts();

  return {
    nfts: swrRes,
  };
};
