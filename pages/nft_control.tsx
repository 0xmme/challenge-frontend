import { create } from "ipfs-http-client";
import { FormEvent, Provider, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import abi from "../lib/abi/IpNft.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";

import { useIpState } from "./store";
import { ethers } from "ethers";

const projectId =
  process.env.INFURA_PROJECT_ID || "2EMSA0X2QRbrMUc7A9AMg1ipxb0"; // <---------- your Infura Project ID

const projectSecret =
  process.env.INFURA_PROJECT_SECRET || "87107f0b2e6dc6f4933ae65fea617b0a"; // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function NftControl() {
  /* testing purpose */
  const ipfsUrl = useIpState((state) => state.ipfsUrl);
  const setIpfsUrl = useIpState((state) => state.setIpfsUrl);
  /* to be removed */

  const topic = useIpState((state) => state.topic);
  const currentTokenId = useIpState((state) => state.currentTokenId);
  const setTokenId = useIpState((state) => state.setCurrentTokenId);
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address } = useAccount();

  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_KEY
  );

  const IpNft = new ethers.Contract(contractAddress, contractABI, provider);

  async function getTokenId() {
    const data = await IpNft.currentTokenCount();
    console.log("tokenid: ", data);
    setTokenId(data);
  }

  useEffect(() => {
    getTokenId();
  }, []);

  const { config: newIpfsConfig } = usePrepareContractWrite({
    address: contractAddress,
    contractInterface: contractABI,
    functionName: "createIpNft",
    args: [],
  });
  const {
    data: writeData,
    isLoading,
    isSuccess,
    write: newIpNft,
  } = useContractWrite(newIpfsConfig);

  return (
    <div>
      <div className="container">
        <h2>Step 2: Create your IP-NFT</h2>
        <p>{ipfsUrl}</p>
        <p>{currentTokenId.toString()}</p>
      </div>
    </div>
  );
}
