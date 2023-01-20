import type { AppProps } from "next/app";
import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { useEffect } from "react";
import { createOrbitDB } from "../store/orbitdb";
import { useIpState } from "../store/store";

const { chains, provider } = configureChains(
  [goerli, mainnet],
  [infuraProvider({ apiKey: "d5e520afcb2848f09ca281103f9e635d" })]
);

const { connectors } = getDefaultWallets({
  appName: "IPNFT flow app",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const setOrbitDb = useIpState((state) => state.setOrbitDb);

  useEffect(() => {
    createOrbitDB()
      .then((res) => {
        setOrbitDb(res);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
