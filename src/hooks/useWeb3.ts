import { useContext } from "react";
import { Web3Context } from "@/providers/Web3";

// Hook para acessar o Web3Context
export function useWeb3() {
  return useContext(Web3Context);
}
