// context/AppKit.tsx

"use client";
import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { testnets, mainnets } from "@/config/config";

// 1. Get projectId at https://cloud.reown.com
const projectId = "f982f42bb1a4986777a021f12635e10a";

// 2. Create a metadata object
const metadata = {
  name: "SecretGrants",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

createWeb3Modal({
  chainImages: {
    // Arbitrum Mainnet
    42161: "https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.5",
    // Linea Mainnet
    59144: "https://lineascan.build/images/svg/brands/main.svg?v=24.4.2.0",

    //Scroll Mainnet
    534352: "https://scrollscan.com/images/svg/brands/main.svg?v=24.4.3.0",

    1328: "https://iili.io/296GXls.png",

    // Metis Mainnet
    1088: "https://cms-cdn.avascan.com/cms2/metis.97de56bab032.svg",

    //Sepolia Testnet
    11155111:
      "https://sepolia.etherscan.io/images/svg/brands/ethereum-original.svg",

    // Scroll Testnet
    534351: "https://scrollscan.com/images/svg/brands/main.svg?v=24.4.3.0",

    // Polygon Amoy Testnet
    80002:
      "https://assets-global.website-files.com/637e2b6d602973ea0941d482/63e26c8a3f6e812d91a7aa3d_Polygon-New-Logo.png",

    // Optimism Testnet
    11155420:
      "https://optimistic.etherscan.io/assets/optimism/images/svg/logos/chain-light.svg?v=24.4.4.4",

    // Arbitrum Testnet
    421614: "https://arbiscan.io/images/svg/brands/arbitrum.svg?v=1.5",

    // Base Sepolia Testnet
    84532: "https://basescan.org/images/svg/brands/main.svg?v=24.4.4.9",

    // Berachain Testnet
    80085:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq-tjg8Kqgr76Ved6PbcjBoGCHWwnhDUljH-CziyBOzw&s",

    // Etherlink Testnet
    128123: "https://www.etherlink.com/favicon.ico",

    //Metis Sepolia Testnet
    59902: "https://cms-cdn.avascan.com/cms2/metis.97de56bab032.svg",

    // Near Aurora Testnet
    1313161555:
      "https://play-lh.googleusercontent.com/0zJGaaodqDL--ig2W2h60zp5uLMexQs4_PRlon5qhakSwqsdwa_ZmV9DQKvg1WVnn-w=w240-h480-rw",

    // Linea Testnet
    59141: "https://lineascan.build/images/svg/brands/main.svg?v=24.4.2.0",

    // XDC Apothem
    51: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe2KDAtPElT99WYln7tyeQPlPCiBWaRfRA_guAL0HImJWBcRympM_r5VBSiOR29zFpKIU&usqp=CAU",

    //Lisk Sepolia
    4202: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRan6D0dfiYmx2sv4kUPsFkfUDxYUWEuuA_dLJWgPm8Q&s",
  },
  ethersConfig,
  chains: [
    mainnets.ethereumMainnet,
    mainnets.binanceSmartChainMainnet,
    mainnets.polygonMainnet,
    mainnets.optimismMainnet,
    mainnets.arbitrumMainnet,
    mainnets.avalancheMainnet,
    mainnets.baseMainnet,
    mainnets.lineaMainnet,
    mainnets.scrollMainnet,
    mainnets.metisMainnet,
    testnets.sepoliaTestnet,
    testnets.scrollTestnet,
    testnets.seiTestnet,
    testnets.polygonTestnet,
    testnets.optimismTestnet,
    testnets.arbitrumTestnet,
    testnets.baseSepoliaTestnet,
    testnets.berachainTestnet,
    testnets.etherlinkTestnet,
    testnets.metisSepoliaTestnet,
    testnets.nearAuroraTestnet,
    testnets.lineaSepoliaTestnet,
    testnets.XDCApothemTestnet,
    testnets.liskSepoliaTestnet,
  ],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function AppKit({ children }: any) {
  return children;
}
