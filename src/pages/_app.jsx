
import { useEffect, useState } from "react";
import "../globalStyles.css";

import { Helmet } from 'react-helmet';

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'

import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet, polygonMumbai, polygon, bsc, sepolia } from 'viem/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const projectId = '6b3b6a75fab4c023e92097eab4b3c923'

export const binance = {
  id: 56,
  name: 'Binance',
  network: 'BSC',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    public: { http: ['https://bsc-dataseed3.defibit.io'] },
    default: { http: ['https://bsc-dataseed3.defibit.io'] },
  }
} 

// 2. Create wagmiConfig
const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [walletConnectProvider({ projectId }), publicProvider()]
)

const metadata = {
  name: '',
  description: '',
  url: '/',
  icons: ['']
}

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ chains, options: { projectId, showQrModal: false, metadata } }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'TEST Presale', // Cambia esto por el nombre de tu aplicación
      }
    }),
    new EIP6963Connector({ chains }),

  ],
  publicClient
})



// 3. Create modal
createWeb3Modal({
  wagmiConfig, projectId, defaultChain: sepolia, 
  themeMode: 'dark', chains,
  themeVariables: {
    '--w3m-accent': '#F8BC00'
  }
})


// 4. Wrap your app with WagmiProvider and add <Web3Modal /> compoennt
export default function App({ Component, pageProps }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>TEST Presale</title>
        <link rel="icon" href="./token.png" type="image/x-icon" />
      </Helmet>


      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

    </>
  );
}