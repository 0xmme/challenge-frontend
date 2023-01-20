import { create } from "ipfs-http-client";
import { FormEvent, useEffect, useState } from "react";
import abi from "../lib/abi/IpNft.json";
import { useAccount, useContractWrite } from "wagmi";

import { useIpState } from "./store";
import { ethers } from "ethers";

const projectId = "2EMSA0X2QRbrMUc7A9AMg1ipxb0"; // <---------- your Infura Project ID
const projectSecret = "87107f0b2e6dc6f4933ae65fea617b0a"; // <---------- your Infura Secret
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

export default function NftMint() {
  const topic = useIpState((state) => state.topic);
  const setTopic = useIpState((state) => state.setTopic);
  const contractCid = useIpState((state) => state.contractCid);
  const setContractCid = useIpState((state) => state.setContractCid);
  const currentTokenId = useIpState((state) => state.currentTokenId);
  const setTokenId = useIpState((state) => state.setCurrentTokenId);
  const getNextTokenId = useIpState((state) => state.getNextTokenId);
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address: connectedWallet } = useAccount();

  const [metadataLocation, setMetadataLocation] = useState("");

  //retrieval of the latest tokenid
  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    "d5e520afcb2848f09ca281103f9e635d"
  );
  const IpNft = new ethers.Contract(contractAddress, contractABI, provider);
  async function getTokenId() {
    const data = await IpNft.currentTokenCount();
    setTokenId(data);
  }
  useEffect(() => {
    getTokenId();
  }, []);

  //hook for minting the nft
  const mintNft = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: contractABI,
    functionName: "safeMint",
    args: [connectedWallet, metadataLocation],
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  //handle form request and store metadata on infura ipfs and then mint nft
  const handleMintRequest = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    setTopic(form.cure.value);
    setContractCid(form.legalCid.value);

    //preparing metadata json for nft
    const metadata = {
      name: "token #" + getNextTokenId(),
      description: "this token can cure " + form.cure.value,
      contractData: "ipfs://" + form.legalCid.value,
    };

    const file = JSON.stringify(metadata);

    try {
      const created = await client.add(file);
      const url = `https://infura-ipfs.io/ipfs/${created.path}`;
      setMetadataLocation(created.path);
    } catch (error) {
      console.log(error.message);
    }
    mintNft.write!();
  };

  //render
  return (
    <div className="container">
      <h2>Step 3: Let brightlisted address mint NFT</h2>
      <div>
        <form onSubmit={handleMintRequest}>
          <label htmlFor="legalCid">CID of the uploaded legal contract</label>
          <input
            type="text"
            id="legalCid"
            name="legalCid"
            className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
          <label htmlFor="cure">Cure or disease of NFT</label>
          <input
            type="text"
            id="cure"
            name="cure"
            className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
          <button
            type="submit"
            className="rounded-md shadow-sm w-full mt-1 bg-indigo-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
