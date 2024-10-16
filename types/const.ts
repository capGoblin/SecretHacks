interface Category {
  title: string;
  href: string;
}

interface Author {
  name: string;
  role: string;
  href: string;
  imageUrl: string;
}

export interface Hackathon {
  id: number;
  title: string;
  href: string;
  description: string;
  imageUrl: string;
  date: string;
  datetime: string;
  network: string;
  matchingPool: string;
  applyPeriod: string;
  // donatePeriod: string;
  category: Category;
  author: Author;
}

export const hackathons: Hackathon[] = [
  {
    id: 1,
    title: "Innovate for Impact Hackathon",
    href: "#",
    description:
      "Join us for a 48-hour hackathon to create innovative solutions for social impact. Teams will work on projects that tackle global challenges, from sustainability to education.",
    imageUrl:
      "https://images.unsplash.com/photo-1611048224764-bc28f8c5b6e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: "Jan 12, 2024",
    datetime: "2024-01-12",
    network: "Ethereum",
    matchingPool: "500,000 USDC",
    applyPeriod: "2024/01/01 09:30 IST - 2024/01/11 10:30 IST",
    category: { title: "Social Impact", href: "#" },
    author: {
      name: "Sarah Johnson",
      role: "Hackathon Organizer",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1501287835420-6ef89e5e7ff9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 2,
    title: "Blockchain for Health Hackathon",
    href: "#",
    description:
      "Develop blockchain-based solutions to improve healthcare delivery and patient data management. Collaborate with experts and make a real difference in the health sector.",
    imageUrl:
      "https://images.unsplash.com/photo-1596509503803-2f35c8730f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: "Feb 18, 2024",
    datetime: "2024-02-18",
    network: "Cosmos",
    matchingPool: "300,000 USDC",
    applyPeriod: "2024/02/01 09:30 IST - 2024/02/17 10:30 IST",
    category: { title: "Healthcare", href: "#" },
    author: {
      name: "Dr. Emily Carter",
      role: "HealthTech Innovator",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1600655546965-3cf6d0a55a1e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 3,
    title: "FinTech Innovation Challenge",
    href: "#",
    description:
      "Compete to build the next big thing in financial technology. This hackathon focuses on creating secure, user-friendly financial applications using blockchain technology.",
    imageUrl:
      "https://images.unsplash.com/photo-1506803032466-e0e8cfc8cc2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: "Mar 25, 2024",
    datetime: "2024-03-25",
    network: "Ethereum L2",
    matchingPool: "450,000 USDC",
    applyPeriod: "2024/03/01 09:30 IST - 2024/03/24 10:30 IST",
    category: { title: "Finance", href: "#" },
    author: {
      name: "David Kim",
      role: "FinTech Specialist",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 4,
    title: "Sustainable Tech Hackathon",
    href: "#",
    description:
      "Join us to develop technologies that promote sustainability. Whether it's renewable energy solutions or waste reduction systems, your innovations can help save the planet.",
    imageUrl:
      "https://images.unsplash.com/photo-1598503731764-0eab8ebc4f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: "Apr 30, 2024",
    datetime: "2024-04-30",
    network: "Base",
    matchingPool: "600,000 USDC",
    applyPeriod: "2024/04/01 09:30 IST - 2024/04/29 10:30 IST",
    category: { title: "Environment", href: "#" },
    author: {
      name: "Laura Bell",
      role: "Environmental Advocate",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1514849732837-f0c62148b7f6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export interface Project {
  id: string;
  network: string;
  name: string;
  openSourceObserverName: string;
  website: string;
  projectLogoUrl: string;
  projectCoverUrl: string;
  description: string;
  createdDate: string;
  twitterUrl: string;
  ownerAddress: string;
  fundingSources: string;
  teamSize: number;
}

export const projects: Project[] = [
  {
    id: "1",
    network: "Ethereum",
    name: "DeFi Stake",
    openSourceObserverName: "DeFiStakeProtocol",
    website: "https://defistake.org/",
    projectLogoUrl: "https://www.example.com/images/defistake_logo.png",
    projectCoverUrl:
      "https://images.unsplash.com/photo-1603349206291-d1e844e5d6df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8fHw%3D&ixlib=rb-1.2.1&q=80&w=1080",
    description:
      "DeFi Stake is a decentralized platform allowing users to stake Ethereum and earn passive rewards with a variable APY.",
    createdDate: "2024-05-10T00:00:00.000Z",
    twitterUrl: "https://twitter.com/defistake",
    ownerAddress: "0xA3EfBe0923C11f238b5FF3e91CEb0a9dC3408A8B",
    fundingSources: "VC-backed",
    teamSize: 5,
  },
  {
    id: "2",
    network: "Polygon",
    name: "GreenChain",
    openSourceObserverName: "GreenChainDAO",
    website: "https://greenchain.network/",
    projectLogoUrl: "https://www.example.com/images/greenchain_logo.png",
    projectCoverUrl:
      "https://images.unsplash.com/photo-1508919801845-fc2ae1bc1daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMDg2fDF8MHw%3D&ixlib=rb-1.2.1&q=80&w=1080",
    description:
      "GreenChain is a sustainability-focused blockchain incentivizing eco-friendly practices through tokenized rewards.",
    createdDate: "2023-09-25T00:00:00.000Z",
    twitterUrl: "https://twitter.com/greenchainDAO",
    ownerAddress: "0xB49cEe343728c95D6e3f9F9C3Ae93B5c4bD7F4e9",
    fundingSources: "Crowdfunded",
    teamSize: 12,
  },
  {
    id: "3",
    network: "Solana",
    name: "Artify",
    openSourceObserverName: "ArtifyNFTs",
    website: "https://artify.market/",
    projectLogoUrl: "https://www.example.com/images/artify_logo.png",
    projectCoverUrl:
      "https://images.unsplash.com/photo-1533560904424-460797a1e5df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxOThiMDF8MHw%3D&ixlib=rb-1.2.1&q=80&w=1080",
    description:
      "Artify is an NFT marketplace focused on empowering digital artists to sell and monetize their artwork with ease.",
    createdDate: "2023-12-01T00:00:00.000Z",
    twitterUrl: "https://twitter.com/artifynfts",
    ownerAddress: "0xA55F430C9212d2118Fa9b54Dca8f0f9719bDFe2F",
    fundingSources: "Angel Investors",
    teamSize: 8,
  },
  {
    id: "4",
    network: "Binance Smart Chain",
    name: "YieldFarmers",
    openSourceObserverName: "YieldFarmersDAO",
    website: "https://yieldfarmers.bsc/",
    projectLogoUrl: "https://www.example.com/images/yieldfarmers_logo.png",
    projectCoverUrl:
      "https://images.unsplash.com/photo-1559674789-f49f5cbdafcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxMHwxfDF8fHx8fHx8&ixlib=rb-1.2.1&q=80&w=1080",
    description:
      "YieldFarmers is a yield farming platform on BSC offering users multiple liquidity pools with optimized returns.",
    createdDate: "2024-02-18T00:00:00.000Z",
    twitterUrl: "https://twitter.com/yieldfarmersdao",
    ownerAddress: "0xE94C4C34Ae9C21bFe5Bb5Eed7E57e1a4a90fCa7e",
    fundingSources: "Self-funded",
    teamSize: 3,
  },
  {
    id: "5",
    network: "Avalanche",
    name: "RedToken",
    openSourceObserverName: "RedTokenProject",
    website: "https://redtoken.io/",
    projectLogoUrl: "https://www.example.com/images/redtoken_logo.png",
    projectCoverUrl:
      "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwxfDB8fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&q=80&w=1080",
    description:
      "RedToken is an Avalanche-based project bringing tokenized real estate to the blockchain for decentralized ownership.",
    createdDate: "2024-01-20T00:00:00.000Z",
    twitterUrl: "https://twitter.com/redtokenproject",
    ownerAddress: "0xD3C6F1C36f22D1bD75Bbf70fE7C1A2fBAf2Bec09",
    fundingSources: "VC-backed",
    teamSize: 15,
  },
];
