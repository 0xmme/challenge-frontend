import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import ContractDataForm from "./contract-data-form";
import Header from "./header";

export default function IndexPage() {
  return (
    <div>
      <Head>
        <title>NFT creation flow</title>
        <meta name="description" content="Learn forms with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Coding challenge for <a href="https://molecule.to">Molecule!</a>
          </h1>
          <ContractDataForm />
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
