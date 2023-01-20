import { FormEvent, useState } from "react";
import abi from "../lib/abi/IpNft.json";
import { useAccount, useContractWrite } from "wagmi";

export default function NftControl() {
  const contractABI = abi.abi;
  const contractAddress = abi.address;
  const { address: connectedWallet } = useAccount();

  //local states as space of functions and address to send to contract
  const [brightlistAction, setBrightlistAction] = useState("grantRole");
  const [brightlistAddress, setBrightlistAddress] = useState("");

  //hook for granting and revoking rule on contract
  const writeBrightList = useContractWrite({
    mode: "recklesslyUnprepared",
    address: contractAddress!,
    abi: contractABI,
    functionName: brightlistAction,
    args: [
      "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6",
      brightlistAddress,
    ],
    onSuccess(data) {
      console.log("Success", data);
    },
  });

  //form handler to send tx to contract
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

  return (
    <div className="container">
      <h2>Step 2: Controll your IP-NFT</h2>
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
    </div>
  );
}
