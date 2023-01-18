/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable unused-imports/no-unused-vars-ts */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/restrict-plus-operands */

import { create } from "ipfs-http-client";
import { NextPage } from "next";
import { useState } from "react";

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

const EncryptionPage: NextPage = (props) => {
  const [file, setFile] = useState(null);
  const [encryptedUrlArr, setEncryptedUrlArr] = useState([]);
  const [encryptedKeyArr, setEncryptedKeyArr] = useState([]);
  const [decryptedFileArr, setDecryptedFileArr] = useState([]);

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

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const created = await client.add(file);
      const url = `https://infura-ipfs.io/ipfs/${created.path}`;

      const encrypted = await Lit.encryptString(url);
      console.log("IPFS URL: ", url);
      console.log("Encrypted String: ", encrypted.encryptedFile);

      setEncryptedUrlArr((prev) => [...prev, encrypted.encryptedFile]);
      setEncryptedKeyArr((prev) => [...prev, encrypted.encryptedSymmetricKey]);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <div className="main">
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div>
        <button className="button" onClick={decrypt}>
          Decrypt
        </button>
        <div className="display">
          {decryptedFileArr.length !== 0 ? (
            decryptedFileArr.map((el) => <img src={el} alt="nfts" />)
          ) : (
            <h3>Upload data, please! </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default EncryptionPage;
