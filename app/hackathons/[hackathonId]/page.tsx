"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, Info } from "lucide-react";
import { Project, projects } from "@/types/const";
import ProjectModal from "@/components/ProjectModal";
import Image from "next/image";
import { CartDrawer } from "@/components/CartDrawer";
import { ethers } from "ethers";
import { ClipLoader } from "react-spinners";
import { SecretNetworkClient } from "secretjs";
import abi from "@/config/abi.js";
import { testnet, mainnet } from "@/config/secretpath.js";
import {
  arrayify,
  hexlify,
  SigningKey,
  keccak256,
  recoverPublicKey,
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
import { hackathons, Hackathon } from "@/types/const";
interface CartItem {
  id: string;
  name: string;
  amount: number;
}

const ProjectCard: React.FC<
  Project & {
    onClick: () => void;
    onAddToCart: (project: Project) => void;
    isInCart: boolean;
  }
> = ({
  id,
  name,
  projectLogoUrl,
  projectCoverUrl,
  description,
  network,
  onClick,
  onAddToCart,
  isInCart,
}) => (
  <div className="rounded-xl bg-white shadow-lg overflow-hidden w-full transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border border-gray-200">
    <div onClick={onClick}>
      <div className="relative h-48">
        <Image
          src={projectCoverUrl}
          alt="Project Banner"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute -bottom-6 left-4 w-20 h-20">
          <Image
            src={projectLogoUrl}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
        <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full">
          {network}
        </span>
      </div>
      <div className="p-6 pt-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate flex-grow">
            {name}
          </h3>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart({
                id,
                name,
                projectLogoUrl,
                projectCoverUrl,
                description,
                network,
                openSourceObserverName: "",
                website: "",
                createdDate: "",
                twitterUrl: "",
                ownerAddress: "",
                fundingSources: "",
                teamSize: 0,
              });
            }}
            className="text-sm px-3 py-1 h-8 w-20"
            variant={isInCart ? "default" : "outline"}
          >
            {isInCart ? "Voted" : "Vote"}
          </Button>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
      </div>
    </div>
  </div>
);

export default function HackathonDetailPage({
  params,
}: {
  params: { hackathonId: number };
}) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [chainId, setChainId] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function daysLeftToDate(futureDate: any) {
    const currentDate = new Date();
    const targetDate = new Date(futureDate);

    const diffTime = targetDate.getTime() - currentDate.getTime();

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  useEffect(() => {
    const handleChainChanged = (_chainId: string) => {
      const numericChainId = parseInt(_chainId, 16);
      setChainId(numericChainId.toString());
      console.log("Network changed to chain ID:", numericChainId);
    };

    if (typeof window !== "undefined" && window.ethereum) {
      // @ts-expect-error Ethereum provider type is not fully recognized
      window.ethereum.on("chainChanged", handleChainChanged);

      const fetchChainId = async () => {
        const provider = new ethers.providers.Web3Provider(
          // @ts-expect-error Ethereum provider type is not fully recognized
          window.ethereum,
          "any"
        );
        const { chainId } = await provider.getNetwork();
        setChainId(chainId.toString());
        console.log("Current Chain ID:", chainId);
      };

      fetchChainId();

      return () => {
        // @ts-expect-error Ethereum provider type is not fully recognized
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const addToCart = (project: Project) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === project.id);
      const totalVotes = prevItems.reduce((sum, item) => sum + item.amount, 0);

      if (existingItem) {
        return prevItems;
      } else if (totalVotes < 100) {
        return [
          ...prevItems,
          { id: project.id, name: project.name, amount: 1 },
        ];
      } else {
        return prevItems;
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateCartItemAmount = (id: string, amount: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, amount: Math.max(0, amount) } : item
      );
      const totalVotes = updatedItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      if (totalVotes <= 100) {
        return updatedItems;
      } else {
        return prevItems;
      }
    });
  };

  const submitVotes = async () => {
    // @ts-expect-error Ethereum provider type is not fully recognized
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const [myAddress] = await provider.send("eth_requestAccounts", []);

    const iface = new ethers.utils.Interface(abi);
    const routing_contract = "secret1wcld9uhn3ngeqdd86jdqvrhjhs2xvk9ukdpuea";
    const routing_code_hash =
      "d972d38e55d427d2b4c9d12d6f93ff50fcca0172cedd886ff6ff821d08857297";

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

    // Prepare votes data
    const votes = cartItems.reduce((acc, item) => {
      // @ts-expect-error Item type is not fully defined
      acc[item.id] = item.amount;
      return acc;
    }, {});

    const data = JSON.stringify({
      votes: votes,
      wallet_address: myAddress,
    });

    console.log("Submitting votes:", data);

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

    // @ts-expect-error publicClientAddress type is not fully defined
    const callbackAddress = publicClientAddress.toLowerCase();
    console.log("callback address: ", callbackAddress);

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
      handle: "create_vote",
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
    const amountOfGas =
      chainId === "4202"
        ? gasFee.mul(callbackGasLimit).mul(100000).div(2)
        : gasFee.mul(callbackGasLimit).mul(3).div(2);

    const tx_params = {
      gas: hexlify(150000),
      to: publicClientAddress,
      from: myAddress,
      value: hexlify(amountOfGas),
      data: functionData,
    };

    try {
      const txResponse = await provider.send("eth_sendTransaction", [
        tx_params,
      ]);

      const receipt = await provider.waitForTransaction(txResponse);
      console.log("Transaction Receipt:", receipt);

      if (receipt.logs) {
        console.log("Transaction Logs:", receipt.logs);

        receipt.logs.forEach((log) => {
          try {
            const decodedLog = iface.parseLog(log);
            if (decodedLog.name === "votes_created") {
              console.log("Votes Created Event:", decodedLog);
            }
          } catch {
            // This log entry isn't for our custom event
          }
        });
      }

      // Clear cart after successful submission
      setCartItems([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const hackathon: Hackathon = hackathons[params.hackathonId - 1];

  const [loading, setLoading] = useState(true); // State for loading
  const [firstFiveProjects, setFirstFiveProjects] = useState([]);

  useEffect(() => {
    const fetchItemsAndVotes = async () => {
      const fetchedItems = await queryAllProposals();

      const updatedProjects = projects.slice(0, 5).map((project, index) => {
        if (index < fetchedItems.length) {
          return {
            ...project,
            // @ts-expect-error Fetched item structure is not fully typed
            name: fetchedItems[index].name || project.name,
            // @ts-expect-error Fetched item structure is not fully typed
            description: fetchedItems[index].description || project.description,
          };
        }
        return project;
      });
      // @ts-expect-error Project type mismatch with fetched data
      setFirstFiveProjects(updatedProjects);

      await queryVotesForItems(fetchedItems);

      setLoading(false);
    };

    fetchItemsAndVotes();
  }, []);

  const queryAllProposals = async () => {
    const secretjs = new SecretNetworkClient({
      url: "https://lcd.testnet.secretsaturn.net",
      chainId: "pulsar-3",
    });

    const items: unknown[] = [];
    let key = 1;
    let continueFetching = true;

    while (continueFetching) {
      try {
        const response = await secretjs.query.compute.queryContract({
          contract_address: "secret1wcld9uhn3ngeqdd86jdqvrhjhs2xvk9ukdpuea",
          code_hash:
            "d972d38e55d427d2b4c9d12d6f93ff50fcca0172cedd886ff6ff821d08857297",
          query: { retrieve_proposal: { key } },
        });

        if (response && response !== "Generic error: Value not found") {
          items.push({ key, ...response });
          key++;
        } else {
          continueFetching = false;
        }
      } catch (error) {
        console.error(`Failed to fetch item with key ${key}:`, error);
        continueFetching = false;
      }
    }

    return items;
  };

  // @ts-expect-error Items type is not fully defined
  const queryVotesForItems = async (items) => {
    const secretjs = new SecretNetworkClient({
      url: "https://lcd.testnet.secretsaturn.net",
      chainId: "pulsar-3",
    });

    const votes: unknown[] = [];
    for (const item of items) {
      try {
        const query_tx = await secretjs.query.compute.queryContract({
          contract_address: "secret1wcld9uhn3ngeqdd86jdqvrhjhs2xvk9ukdpuea",
          code_hash:
            "d972d38e55d427d2b4c9d12d6f93ff50fcca0172cedd886ff6ff821d08857297",
          query: { retrieve_votes: { key: item.key } },
        });

        // @ts-expect-error Query response structure is not fully typed
        if (query_tx && query_tx.message) {
          votes.push({
            // @ts-expect-error Query response structure is not fully typed
            message: query_tx.message,
            // @ts-expect-error Query response structure is not fully typed
            voteCount: query_tx.vote_count,
            // @ts-expect-error Query response structure is not fully typed
            voteDetails: query_tx.vote_details,
            // @ts-expect-error Query response structure is not fully typed
            totalVotes: query_tx.total_votes,
          });
        } else {
          votes.push({
            message: "No votes available for this item",
            voteCount: 0,
            voteDetails: [],
            totalVotes: 0,
          });
        }
      } catch (error) {
        console.error(
          `Failed to query votes for item with key ${item.key}:`,
          error
        );
        votes.push({
          message: "Error fetching votes",
          voteCount: 0,
          voteDetails: [],
          totalVotes: 0,
        });
      }
    }
    console.log(votes);
  };

  const isProjectInCart = (projectId: string) => {
    return cartItems.some((item) => item.id === projectId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <ClipLoader color="#ffffff" loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {hackathon.title}
              </h1>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <span className="bg-gradient-to-r from-green-500 to-gray-700 text-white px-3 py-1 rounded-full mr-2">
                  Quadratic Funding
                </span>
                <span className="flex items-center">
                  on{" "}
                  <Image
                    src="/base-logo.png"
                    alt="Base"
                    width={16}
                    height={16}
                    className="mx-1"
                  />{" "}
                  {hackathon.network}
                </span>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-right">
              <div className="text-2xl font-bold text-gray-800">
                {hackathon.matchingPool}
              </div>
              <div className="text-sm text-gray-600">Matching Pool</div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Calendar className="mr-2" size={16} />
            <span className="font-semibold mr-2">Apply:</span>
            <span>{hackathon.applyPeriod}</span>
          </div>
          <p className="text-gray-700 mb-6">{hackathon.description}</p>
          <div className="bg-gradient-to-r from-green-100 to-gray-200 p-4 rounded-lg text-center">
            <p className="text-gray-800 mb-2">
              <span className="font-bold">
                {daysLeftToDate(
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                )}{" "}
                days
              </span>{" "}
              left to apply!
            </p>
            <Link href={`/hackathons/${hackathon.id}/create-project`}>
              <Button className="bg-gradient-to-r from-green-500 to-gray-700 text-white hover:from-green-600 hover:to-gray-800">
                Apply now
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            All Projects ({firstFiveProjects.length})
          </h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center"
            >
              <ShoppingCart className="mr-2" size={18} />
              Cart ({cartItems.length})
            </Button>
            <Button variant="ghost" className="flex items-center">
              <Info className="mr-2" size={18} />
              Stats
            </Button>
            <input
              type="text"
              placeholder="Search projects..."
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {firstFiveProjects.map((project: Project, index) => (
            <ProjectCard
              key={index}
              {...project}
              onClick={() => handleProjectClick(project)}
              onAddToCart={addToCart}
              isInCart={isProjectInCart(project.id)}
            />
          ))}
        </div>
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onUpdateAmount={updateCartItemAmount}
          onSubmitVotes={submitVotes}
        />
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}
