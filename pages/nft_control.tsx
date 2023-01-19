import { create } from "ipfs-http-client";
import { FormEvent, Provider, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import abi from "../lib/abi/IpNft.json";
//import abi from "../lib/abi/IpNft_bytecode.json";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { useIpState } from "./store";
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";

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

export default function NftControl() {
  const topic = useIpState((state) => state.topic);
  const contractCid = useIpState((state) => state.contractCid);
  const currentTokenId = useIpState((state) => state.currentTokenId);
  const setTokenId = useIpState((state) => state.setCurrentTokenId);
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address: connectedWallet } = useAccount();

  const [brightlistAction, setBrightlistAction] = useState("");
  const [brightlistAddress, setBrightlistAddress] = useState("");

  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    "d5e520afcb2848f09ca281103f9e635d"
  );

  const IpNft = new ethers.Contract(contractAddress, contractABI, provider);

  async function getTokenId() {
    const data = await IpNft.currentTokenCount();
    console.log("tokenid: ", data);
    setTokenId(data);
  }

  const metadata = {
    name: "token #" + currentTokenId,
    description: "this token can cure " + topic,
    contractData: "ipfs://" + contractCid,
  };

  console.log(metadata);

  useEffect(() => {
    getTokenId();
  }, []);

  const { config: brightListConfig } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: brightlistAction,
    args: [ethers.utils.formatBytes32String("MINTER ROLE"), brightlistAddress],
  });

  const writeBrightList = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress,
    abi: contractABI,
    functionName: brightlistAction,
    args: [ethers.utils.formatBytes32String("MINTER ROLE"), brightlistAddress],
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  //console.log(brightListData);

  const handleBrightlist = (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    // Get data from the form.
    const actionType = form.actionType.value;
    const bladdress = form.brightlistAddress.value;

    setBrightlistAddress(bladdress);

    if (actionType == "Grant") {
      setBrightlistAction("grantRole");
    } else if (actionType == "Revoke") {
      setBrightlistAction("revokeRole");
    }

    writeBrightList.write!();
  };

  const handleMintRequest = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    //try {
    //  const created = await client.add(file);
    //  const url = `https://infura-ipfs.io/ipfs/${created.path}`;
    //  //setIpfsUrl(url);
    //  //setContractCid(created.cid);

    //  //console.log("Encrypted String: ", encrypted.encryptedFile);
    //} catch (error) {
    //  console.log(error.message);
    //}
  };

  return (
    <div>
      <div className="container">
        <h2>Step 2: Controll your IP-NFT</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <form onSubmit={handleBrightlist}>
              <label htmlFor="brightlistAddress">Address</label>
              <input
                type="text"
                id="brightlistAddress"
                name="brightlistAddress"
                className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
              <label htmlFor="actionType">
                Grant or Revoke rights to mint NFT.
              </label>
              <select
                id="actionType"
                name="actionType"
                className="mt-1 mb-10 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option>Grant</option>
                <option>Revoke</option>
              </select>
              <button
                type="submit"
                className="rounded-md shadow-sm w-full mt-1 bg-indigo-600"
              >
                Submit
              </button>
            </form>
          </div>
          <div>
            <form>
              <label htmlFor="legalCid">
                CID of the uploaded legal contract
              </label>
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
      </div>
    </div>
  );
}
