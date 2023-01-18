import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IpState {
  ipfsUrl: string;
  setIpfsUrl: (newUrl: any) => void;
  contractCid: string;
  setContractCid: (newCid: any) => void;
  topic: string;
  setTopic: (newTopic: any) => void;
  currentTokenId: string;
  setCurrentTokenId: (newTokenId: any) => void;
}

export const useIpState = create<IpState>()((set) => ({
  ipfsUrl: "",
  setIpfsUrl: (newUrl) => set((state) => ({ ipfsUrl: newUrl })),
  contractCid: "",
  setContractCid: (newCid) => set((state) => ({ contractCid: newCid })),
  topic: "",
  setTopic: (newTopic) => set((state) => ({ topic: newTopic })),
  currentTokenId: "",
  setCurrentTokenId: (newTokenId) =>
    set((state) => ({ currentTokenId: newTokenId })),
}));
