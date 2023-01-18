import Link from "next/link";
import { create } from "ipfs-http-client";

import { fromJSON } from "postcss";
import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import Header from "./header";

import Lit from "../lib/lit/lit";

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

export default function ContractDataForm() {
  //const [file, setFile] = useState(null);
  const [encryptedUrlArr, setEncryptedUrlArr] = useState([]);
  const [encryptedKeyArr, setEncryptedKeyArr] = useState([]);
  const [decryptedFileArr, setDecryptedFileArr] = useState([]);
  const [ipfsUrl, setIpfsUrl] = useState("");

  function retrieveFile(e) {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
      console.log(Buffer(reader.result));
    };

    e.preventDefault();
  }

  function decrypt() {
    if (encryptedUrlArr.length !== 0) {
      Promise.all(
        encryptedUrlArr.map((url, idx) => {
          return Lit.decryptString(url, encryptedKeyArr[idx]);
        })
      ).then((values) => {
        setDecryptedFileArr(
          values.map((v) => {
            return v.decryptedFile;
          })
        );
      });
    }
  }

  // Handle the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    //Check if the Patent ID is correct.
    if (form.patent_id.value.match("[A-F]-[1-9]{5,7}/[A-Z]{5,9}") == null) {
      alert(
        "Please provide Patent ID in the format [A-F]-[1-9]{5,7}/[A-Z]{5,9}"
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

    try {
      const encrypted = await Lit.encryptString(file);

      const created = await client.add(encrypted.encryptedFile);
      const url = `https://infura-ipfs.io/ipfs/${created.path}`;
      setIpfsUrl(url);

      console.log("IPFS URL: ", url);
      //console.log("Encrypted String: ", encrypted.encryptedFile);

      setEncryptedUrlArr((prev) => [...prev, encrypted.encryptedFile]);
      setEncryptedKeyArr((prev) => [...prev, encrypted.encryptedSymmetricKey]);

      localStorage.setItem(
        "encryptedSymmetricKey",
        encrypted.encryptedSymmetricKey
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div className="container">
        <h2>Step 1 legal contract data</h2>

        <p className={styles.description}>
          Please provide Patent ID in the form
          <code className={styles.code}>
            [A-F]-[1-9]{(5, 7)}\/[A-Z]{(5, 9)}
          </code>{" "}
          e.g.
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
        {ipfsUrl ? <div>{ipfsUrl}</div> : <div></div>}
      </div>
    </div>
  );
}
