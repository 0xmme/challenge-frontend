import { create } from "ipfs-http-client";
import { FormEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import abi from "../lib/abi/IpNft.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";

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
  const [currentTokenId, setCurrentTokenId] = useState("");

  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddress,
    contractInterface: contractABI,
    functionName: "currentTokenCount",
  });

  const { config: newIpfsConfig } = usePrepareContractWrite({
    address: contractAddress,
    contractInterface: contractABI,
    functionName: "createIpNft",
    args: [address, currentTokenId, contractCid],
  });
  const {
    data: writeData,
    isLoading,
    isSuccess,
    write: newAdSpace,
  } = useContractWrite(newIpfsConfig);

  useEffect(() => {
    useContractRead;
    setCurrentTokenId(data);
    console.log(data);
  }, []);

  return (
    <div>
      <div className="container">
        <h2>Step 2 add or remove brightlisted addresses</h2>
      </div>
    </div>
  );
}
