import { useContext } from "react";
import { Web3Context } from "@/context";

// Hook para acessar o Web3Context
function useWeb3Context() {
  return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3Context();
  return hooks;
}
