import { create } from "ipfs-http-client";
import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import { useIpState } from "../store/store";

import Lit from "../lib/lit/lit";

const projectId = "2EMSA0X2QRbrMUc7A9AMg1ipxb0"; // <---------- your Infura Project ID
const projectSecret = "87107f0b2e6dc6f4933ae65fea617b0a"; // <---------- your Infura Secret
// i know these are burned now ;-)

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

export default function ContractDataForm() {
  //const [encryptedUrlArr, setEncryptedUrlArr] = useState([]);
  //const [encryptedKeyArr, setEncryptedKeyArr] = useState([]);
  //const [decryptedFileArr, setDecryptedFileArr] = useState([]);

  const ipfsUrl = useIpState((state) => state.ipfsUrl);
  const setIpfsUrl = useIpState((state) => state.setIpfsUrl);
  const contractCid = useIpState((state) => state.contractCid);
  const setContractCid = useIpState((state) => state.setContractCid);
  const encryptionKey = useIpState((state) => state.encryptionKey);
  const setEncryptionKey = useIpState((state) => state.setEncryptionKey);
  const topic = useIpState((state) => state.topic);
  const setTopic = useIpState((state) => state.setTopic);

  //function decrypt() {
  //  if (encryptedUrlArr.length !== 0) {
  //    Promise.all(
  //      encryptedUrlArr.map((url, idx) => {
  //        return Lit.decryptString(url, encryptedKeyArr[idx]);
  //      })
  //    ).then((values) => {
  //      setDecryptedFileArr(
  //        values.map((v) => {
  //          return v.decryptedFile;
  //        })
  //      );
  //    });
  //  }
  //}

  // Handle the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    //Check if the Patent ID is correct.
    if (form.patent_id.value.match("[A-F]-[1-9]{5,7}/[A-Z]{5,9}") == null) {
      alert(
        "Please provide Patent ID in the format of this example: A-12345/HAYFEVER"
      );
      return;
    }

    // Get data from the form.
    const data = {
      researcher: form.researcher.value as string, //the name of the lead reasearcher
      university: form.university.value as string, //the name of their university
      patent_filed: {
        patent_id: form.patent_id.value as string, //must follow the pattern "[A-F]-[1-9]{5,7}\/[A-Z]{5,9}", e.g. A-12345/HAYFEVER
        institution: form.institution.value as string, //the name of the filing institution
      },
    };

    const file = JSON.stringify(data);

    setTopic(form.topic.value);

    try {
      const encrypted = await Lit.encryptString(file);

      const created = await client.add(encrypted.encryptedFile);
      const url = `https://infura-ipfs.io/ipfs/${created.path}`;
      setIpfsUrl(url);
      setContractCid(created.path);
      setEncryptionKey(encrypted.encryptedSymmetricKey);

      console.log("Encrypted File: ", encrypted.encryptedFile);

      //setEncryptedUrlArr((prev) => [...prev, encrypted.encryptedFile]);
      //setEncryptedKeyArr((prev) => [...prev, encrypted.encryptedSymmetricKey]);

      localStorage.setItem("contractCid", contractCid);
      localStorage.setItem(
        "encryptedSymmetricKey",
        encrypted.encryptedSymmetricKey
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //render
  return (
    <div>
      <div className="container">
        <h2>Step 1: Add your legal contract data</h2>

        <p className={styles.description}>
          Please provide Patent ID in a form like this:
          <code className={styles.code}>A-12345/HAYFEVER</code>
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="researcher">Reseacher</label>
          <input
            type="text"
            id="researcher"
            name="researcher"
            className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
          <label htmlFor="university">University</label>
          <input
            type="text"
            id="university"
            name="university"
            className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
          <label htmlFor="topic">Reseach Topic / Disease</label>
          <input
            type="text"
            id="topic"
            name="topic"
            className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
          <label htmlFor="patent_id" className="control-label">
            Patent ID
          </label>
          <input
            type="text"
            id="patent_id"
            name="patent_id"
            className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
          form-control"
            required
            //onChange={handlePatentChange}
            //value={patentId}
          />
          <label htmlFor="institution">Institution</label>
          <input
            type="text"
            id="institution"
            name="institution"
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
        {ipfsUrl ? (
          <div>
            <p>Here you&apos;ll find your encrypted file:</p>
            {ipfsUrl}
            <p>The CID of your contract file is:</p>
            <b>{contractCid}</b>
            <span> (keep this for Step 3)</span>
            <p>Your encryption key is saved in your browser.</p>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
