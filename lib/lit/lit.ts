import LitJsSdk from "lit-js-sdk";

// initiate Lit Protocol
const client = new LitJsSdk.LitNodeClient();
const chain = "goerli";

const accessControlConditionsOwner = [
  {
    contractAddress: "",
    standardContractType: "",
    chain,
    method: "",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: "=",
      value: "0x25549a401f9C04c51d13202f6C87A2c244325A5C",
    },
  },
];

class Lit {
  litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptString(str: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str);

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: accessControlConditionsOwner,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedFile: encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async decryptString(encryptedStr: string, encryptedSymmetricKey: any) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditionsOwner,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });
    const decryptedFile = await LitJsSdk.decryptString(
      encryptedStr,
      symmetricKey
    );
    // eslint-disable-next-line no-console
    console.log({
      decryptedFile,
    });
    return { decryptedFile };
  }
}

export default new Lit() as Lit;
