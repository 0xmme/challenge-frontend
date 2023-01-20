import OrbitDB from "orbit-db";
import * as IPFS from "ipfs-core";
import { useIpState } from "./store";

export async function createOrbitDB() {
  // Create IPFS instance
  const ipfsOptions = { repo: "./ipfs" };

  const ipfs = await IPFS.create(ipfsOptions);

  //console.log(ipfs);

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs);

  const db = await orbitdb.keyvalue("cid-encryption-pair", {
    create: true,
    overwrite: false,
  });

  await db.load();

  //console.log(db);
  return db;
}
