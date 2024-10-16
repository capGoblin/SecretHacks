"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useDropzone } from "react-dropzone";
import { ethers } from "ethers";
import { testnet, mainnet } from "@/config/secretpath.js";
import {
  arrayify,
  hexlify,
  SigningKey,
  keccak256,
  recoverPublicKey,
  // Remove unused import
  // computeAddress,
} from "ethers/lib/utils";
import { ecdh, chacha20_poly1305_seal } from "@solar-republic/neutrino";
import {
  bytes,
  bytes_to_base64,
  json_to_bytes,
  sha256,
  concat,
  text_to_bytes,
  base64_to_bytes,
} from "@blake.regalia/belt";
import abi from "@/config/abi.js";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  label: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, label }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-gray-400"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <div>
          <p>Click to Upload or Drag and Drop</p>
          <p className="text-sm text-gray-500">PNG or JPG</p>
        </div>
      )}
      {label && <p className="mt-2 text-sm text-gray-600">{label}</p>}
    </div>
  );
};

const CreateProjectForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const hackathonId = params.hackathonId as string;

  // Remove unused state
  // const [formData, setFormData] = useState({
  //   network: "Base",
  //   projectName: "",
  //   projectWebsite: "",
  //   projectDescription: "",
  //   twitterUrl: "",
  // });

  const [projectLogo, setProjectLogo] = useState<File | null>(null);
  const [projectBanner, setProjectBanner] = useState<File | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [minutes, setMinutes] = useState("20");
  const [chainId, setChainId] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [projectWebsite, setProjectWebsite] = useState("");

  useEffect(() => {
    const handleChainChanged = (_chainId: string) => {
      const numericChainId = parseInt(_chainId, 16);
      setChainId(numericChainId.toString());
      console.log("Network changed to chain ID:", numericChainId);
    };

    // @ts-expect-error: window.ethereum is not typed in the global scope
    window.ethereum.on("chainChanged", handleChainChanged);

    const fetchChainId = async () => {
      const provider = new ethers.providers.Web3Provider(
        // @ts-expect-error: window.ethereum is not typed in the global scope
        window.ethereum,
        "any"
      );
      const { chainId } = await provider.getNetwork();
      setChainId(chainId.toString());
      console.log("Current Chain ID:", chainId);
    };

    fetchChainId();

    return () => {
      // @ts-expect-error: window.ethereum is not typed in the global scope
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => ({ ...prevState, [name]: value }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const iface = new ethers.utils.Interface(abi);
    const routing_contract = "secret1wcld9uhn3ngeqdd86jdqvrhjhs2xvk9ukdpuea";
    const routing_code_hash =
      "d972d38e55d427d2b4c9d12d6f93ff50fcca0172cedd886ff6ff821d08857297";

    // @ts-expect-error: window.ethereum is not typed in the global scope
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const [myAddress] = await provider.send("eth_requestAccounts", []);

    const wallet = ethers.Wallet.createRandom();
    const userPrivateKeyBytes = arrayify(wallet.privateKey);
    const userPublicKey = new SigningKey(wallet.privateKey).compressedPublicKey;
    const userPublicKeyBytes = arrayify(userPublicKey);
    const gatewayPublicKey = "A20KrD7xDmkFXpNMqJn1CLpRaDLcdKpO1NdBBS7VpWh3";
    const gatewayPublicKeyBytes = base64_to_bytes(gatewayPublicKey);

    const sharedKey = await sha256(
      ecdh(userPrivateKeyBytes, gatewayPublicKeyBytes)
    );

    const callbackSelector = iface.getSighash(
      iface.getFunction("upgradeHandler")
    );
    const callbackGasLimit = 300000;

    // Create the data object from form state
    const data = JSON.stringify({
      name: name,
      description: description,
      end_time: "43200", // 30-days
    });

    let publicClientAddress;

    if (chainId === "1") {
      publicClientAddress = mainnet.publicClientAddressEthereumMainnet;
    }
    if (chainId === "56") {
      publicClientAddress = mainnet.publicClientAddressBinanceSmartChainMainnet;
    }
    if (chainId === "137") {
      publicClientAddress = mainnet.publicClientAddressPolygonMainnet;
    }
    if (chainId === "10") {
      publicClientAddress = mainnet.publicClientAddressOptimismMainnet;
    }
    if (chainId === "42161") {
      publicClientAddress = mainnet.publicClientAddressArbitrumOneMainnet;
    }
    if (chainId === "43114") {
      publicClientAddress = mainnet.publicClientAddressAvalanceCChainMainnet;
    }
    if (chainId === "8453") {
      publicClientAddress = mainnet.publicClientAddressBaseMainnet;
    }

    if (chainId === "59144") {
      publicClientAddress = mainnet.publicClientAddressLineaMainnet;
    }

    if (chainId === "534352") {
      publicClientAddress = mainnet.publicClientAddressScrollMainnet;
    }

    if (chainId === "1088") {
      publicClientAddress = mainnet.publicClientAddressMetisMainnet;
    }

    if (chainId === "11155111") {
      publicClientAddress = testnet.publicClientAddressSepoliaTestnet;
    }
    if (chainId === "534351") {
      publicClientAddress = testnet.publicClientAddressScrollTestnet;
    }
    if (chainId === "80002") {
      publicClientAddress = testnet.publicClientAddressPolygonAmoyTestnet;
    }
    if (chainId === "11155420") {
      publicClientAddress = testnet.publicClientAddressOptimismSepoliaTestnet;
    }
    if (chainId === "421614") {
      publicClientAddress = testnet.publicClientAddressArbitrumSepoliaTestnet;
    }
    if (chainId === "84532") {
      publicClientAddress = testnet.publicClientAddressBaseSepoliaTestnet;
    }

    if (chainId === "80085") {
      publicClientAddress = testnet.publicClientAddressBerachainTestnet;
    }

    if (chainId === "128123") {
      publicClientAddress = testnet.publicClientAddressEtherlinkTestnet;
    }
    if (chainId === "59902") {
      publicClientAddress = testnet.publicClientAddressMetisSepoliaTestnet;
    }
    if (chainId === "1313161555") {
      publicClientAddress = testnet.publicClientAddressNearAuroraTestnet;
    }
    if (chainId === "59141") {
      publicClientAddress = testnet.publicClientAddressLineaSepoliaTestnet;
    }
    if (chainId === "51") {
      publicClientAddress = testnet.publicClientAddressXDCApothemTestnet;
    }
    if (chainId === "4202") {
      publicClientAddress = testnet.publicClientAddressLiskSepoliaTestnet;
    }

    // @ts-expect-error: publicClientAddress might be undefined
    const callbackAddress = publicClientAddress.toLowerCase();
    console.log("callback address: ", callbackAddress);
    console.log(data);
    console.log(callbackAddress);

    // Payload construction
    const payload = {
      data: data,
      routing_info: routing_contract,
      routing_code_hash: routing_code_hash,
      user_address: myAddress,
      user_key: bytes_to_base64(userPublicKeyBytes),
      callback_address: bytes_to_base64(arrayify(callbackAddress)),
      callback_selector: bytes_to_base64(arrayify(callbackSelector)),
      callback_gas_limit: callbackGasLimit,
    };

    // Remove unused variable
    // const payloadJson = JSON.stringify(payload);
    const plaintext = json_to_bytes(payload);
    const nonce = crypto.getRandomValues(bytes(12));

    const [ciphertextClient, tagClient] = chacha20_poly1305_seal(
      sharedKey,
      nonce,
      plaintext
    );
    const ciphertext = concat([ciphertextClient, tagClient]);
    const ciphertextHash = keccak256(ciphertext);
    const payloadHash = keccak256(
      concat([
        text_to_bytes("\x19Ethereum Signed Message:\n32"),
        arrayify(ciphertextHash),
      ])
    );
    const msgParams = ciphertextHash;

    const params = [myAddress, msgParams];
    const method = "personal_sign";
    const payloadSignature = await provider.send(method, params);
    const user_pubkey = recoverPublicKey(payloadHash, payloadSignature);

    const _info = {
      user_key: hexlify(userPublicKeyBytes),
      user_pubkey: user_pubkey,
      routing_code_hash: routing_code_hash,
      task_destination_network: "pulsar-3",
      handle: "create_proposal",
      nonce: hexlify(nonce),
      payload: hexlify(ciphertext),
      payload_signature: payloadSignature,
      callback_gas_limit: callbackGasLimit,
    };

    const functionData = iface.encodeFunctionData("send", [
      payloadHash,
      myAddress,
      routing_contract,
      _info,
    ]);

    const gasFee = await provider.getGasPrice();
    let amountOfGas;
    if (chainId === "4202") {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(100000).div(2);
    } else {
      amountOfGas = gasFee.mul(callbackGasLimit).mul(3).div(2);
    }

    const tx_params = {
      gas: hexlify(150000),
      to: publicClientAddress,
      from: myAddress,
      value: hexlify(amountOfGas),
      data: functionData,
    };

    try {
      const txHash = await provider.send("eth_sendTransaction", [tx_params]);
      console.log(`Transaction Hash: ${txHash}`);
      handleBack();
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const handleBack = () => {
    router.push(`/${hackathonId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex">
          {/* Left Column */}
          <div className="w-1/3 pr-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Create a Project for Hackathon
            </h1>
            <p className="text-gray-600 mb-4">
              Tell us more about what you&apos;re working on.
            </p>
            <p className="text-blue-600 mb-6">
              Need Help? Check out the Builder Guide.
            </p>
            <Button
              onClick={handleBack}
              variant="outline"
              className="text-red-500 hover:text-red-700"
            >
              × Exit
            </Button>
          </div>

          {/* Right Column - Form */}
          <div className="w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Deployment Network{" "}
                  <span className="text-red-500">*Required</span>
                </label>
                <select
                  name="network"
                  value={chainId}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Polygon">Polygon</option>
                  {/* Add other network options here */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*Required</span>
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Website{" "}
                  <span className="text-red-500">*Required</span>
                </label>
                <input
                  type="url"
                  name="projectWebsite"
                  value={projectWebsite}
                  onChange={(e) => setProjectWebsite(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Logo
                </label>
                <FileUpload
                  onFileSelect={(file) => setProjectLogo(file)}
                  label={projectLogo ? `Selected: ${projectLogo.name}` : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Banner
                </label>
                <FileUpload
                  onFileSelect={(file) => setProjectBanner(file)}
                  label={projectBanner ? `Selected: ${projectBanner.name}` : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description{" "}
                  <span className="text-red-500">*Required</span>
                </label>
                <textarea
                  name="projectDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter URL
                </label>
                <input
                  type="url"
                  name="twitterUrl"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Next
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectForm;
