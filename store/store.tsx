import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IpState {
  ipfsUrl: string;
  setIpfsUrl: (newUrl: any) => void;
  contractCid: string;
  setContractCid: (newCid: any) => void;
  encryptionKey: any;
  setEncryptionKey: (newKey: any) => void;
  topic: string;
  setTopic: (newTopic: any) => void;
  currentTokenId: string;
  setCurrentTokenId: (newTokenId: any) => void;
  getNextTokenId: () => number;
  provider: any;
  setProvider: (newProvider: any) => void;
  signer: any;
  setSigner: (newSigner: any) => void;
}

export const useIpState = create<IpState>()((set, get) => ({
  ipfsUrl: "",
  setIpfsUrl: (newUrl) => set((state) => ({ ipfsUrl: newUrl })),
  contractCid: "",
  setContractCid: (newCid) => set((state) => ({ contractCid: newCid })),
  encryptionKey: "",
  setEncryptionKey: (newEncryptionKey) =>
    set((state) => ({ encryptionKey: newEncryptionKey })),
  topic: "",
  setTopic: (newTopic) => set((state) => ({ topic: newTopic })),
  currentTokenId: "",
  setCurrentTokenId: (newTokenId) =>
    set((state) => ({ currentTokenId: newTokenId })),
  getNextTokenId: () => {
    let nextToken: number = get().currentTokenId as unknown as number;
    nextToken++;
    return nextToken;
  },
  provider: {},
  setProvider: (newProvider) => set((state) => ({ provider: newProvider })),
  signer: {},
  setSigner: (newSigner) => set((state) => ({ signer: newSigner })),
}));
