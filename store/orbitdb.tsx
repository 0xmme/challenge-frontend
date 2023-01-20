import OrbitDB from "orbit-db";
import * as IPFS from "ipfs-core";
import { useIpState } from "./store";

export async function createOrbitDB() {
  // Create IPFS instance
  const ipfsOptions = { repo: "./ipfs" };

  const ipfs = await IPFS.create(ipfsOptions);

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs);

  const db = await orbitdb.keyvalue("cid-encryption-pair", {
    create: true,
    overwrite: false,
  });

  // open OrbitDB instance
  await db.load();

  return db;
}
