import { create } from "ipfs-http-client";
import { FormEvent, useEffect, useState } from "react";
import abi from "../lib/abi/IpNft.json";
import { useAccount, useContractWrite } from "wagmi";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useIpState } from "../store/store";
import { ethers } from "ethers";

const projectId = "2EMSA0X2QRbrMUc7A9AMg1ipxb0"; // <---------- your Infura Project ID
const projectSecret = "87107f0b2e6dc6f4933ae65fea617b0a"; // <---------- your Infura Secret
// i know these are burned now ;-)

const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// create ipfs client
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default function NftMint() {
  // get all states and functions from zustand
  const topic = useIpState((state) => state.topic);
  const setTopic = useIpState((state) => state.setTopic);
  const contractCid = useIpState((state) => state.contractCid);
  const setContractCidMint = useIpState((state) => state.setContractCidMint);
  const currentTokenId = useIpState((state) => state.currentTokenId);
  const setTokenId = useIpState((state) => state.setCurrentTokenId);
  const getNextTokenId = useIpState((state) => state.getNextTokenId);
  const symmetricKey = useIpState((state) => state.symmetricKey);
  const setSymmetricKey = useIpState((state) => state.setSymmetricKey);
  const orbitDb = useIpState((state) => state.orbitDb);
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address: connectedWallet } = useAccount();

  //setting some local states...
  const [metadataLocation, setMetadataLocation] = useState("");
  const [nftMinted, setNftMinted] = useState(false);
  const [copied, setCopied] = useState(false);

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
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: "safeMint",
    args: [connectedWallet, metadataLocation],
    // when sucessful set this in a state...
    onSuccess(data) {
      console.log("success: ", data);
      setNftMinted(true);
    },
    onError(error) {
      console.log(error);
      alert("Error: Please make sure your address is brightlisted!");
    },
  });

  //handle form request and store metadata on infura ipfs and then mint nft
  const handleMintRequest = async (event: FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    setTopic(form.cure.value);
    setContractCidMint(form.legalCid?.value);

    //preparing metadata json for nft
    const metadata = {
      name: "token #" + getNextTokenId(),
      description: "this token can cure " + form.cure.value,
      contractData: "ipfs://" + form.legalCid.value,
    };

    const file = JSON.stringify(metadata);

    // upload metadata file to ipfs using infura
    try {
      const created = await client.add(file);
      setMetadataLocation(created.path);
    } catch (error: any) {
      console.log(error.message);
    }

    // calling the actual transaction hook of wagmi
    mintNft.write!();
    const cidFromForm = form.legalCid.value;
    orbitDb.load();
    const value = orbitDb.get(cidFromForm);
    setSymmetricKey(value);
    localStorage.setItem("contractCid", contractCid);
    localStorage.setItem("encryptedSymmetricKey", value);
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

      {symmetricKey && nftMinted ? (
        <>
          <p>Your key for decryption is: </p>
          <br />
          <p className="break-all">{symmetricKey}</p>
          <br />
          <CopyToClipboard text={symmetricKey} onCopy={() => setCopied(true)}>
            <button className="rounded-md shadow-sm w-full mt-1 bg-indigo-600">
              Copy to clipboard!
            </button>
          </CopyToClipboard>
        </>
      ) : (
        "no symmetric key"
      )}
    </div>
  );
}
