import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import Header from "./header";

export default function IndexPage() {
  return (
    <div>
      <Head>
        <title>Next.js forms</title>
        <meta name="description" content="Learn forms with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Coding challenge for <a href="https://molecule.to">Molecule!</a>
          </h1>

          <div className={styles.grid}>
            <Link href="/contract-data-form" className={styles.card}>
              <h2>Create and encrypt contract data;</h2>
              <p>
                Upload encrypted contract data to a decentralised storage before
                minting NFT.
              </p>
            </Link>
            <Link href="/js-form" className={styles.card}>
              <h2>Form with JavaScript &rarr;</h2>
              <p>Learn to handle forms with JavaScript in Next.js.</p>
            </Link>
          </div>
        </main>

        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
