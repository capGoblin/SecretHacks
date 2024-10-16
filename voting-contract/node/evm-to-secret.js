import {
  AxelarAssetTransfer,
  CHAINS,
  Environment,
} from "@axelar-network/axelarjs-sdk";

const sdk = new AxelarAssetTransfer({ environment: "testnet" });

async function createDepositAddress() {
  const fromChain = CHAINS.TESTNET.SEPOLIA,
    toChain = "secret-snip-3",
    destinationAddress = "secret1q42qnccxnrgnuy9ge92xs5kuyvxr4gweaa896c",
    asset = "uausdc";

  const depositAddress = await sdk.getDepositAddress({
    fromChain,
    toChain,
    destinationAddress,
    asset,
  });
  console.log(depositAddress);
}

createDepositAddress();
// 0x77F65150b512bf9A0DD8CCa3C61b39D0fC80bE9E
