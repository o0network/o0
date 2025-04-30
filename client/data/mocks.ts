export type VideoData = {
  address: string;
  timestamp: number;
  source: any;
  stats?: string[];
};

export type AssetType = "eth" | "weth" | "usdc" | "nft" | "token";

export type AssetData = {
  id: string;
  address: string;
  shortAddress: string;
  name: string;
  symbol: string;
  type: AssetType;
  balance: string;
  value: string;
  priceUsd: number;
  priceChange: number;
  color?: string;
  lastUpdated: string;
};

export type PriceData = {
  points: number[][];
  timeframe: string;
};

export const mockPriceData: Record<string, PriceData> = {
  "o0.network": {
    timeframe: "1Y",
    points: [
      [0, 48],
      [1, 52],
      [2, 50],
      [3, 55],
      [4, 60],
      [5, 58],
      [6, 62],
      [7, 65],
      [8, 63],
      [9, 68],
      [10, 65],
      [11, 70],
      [12, 75],
      [13, 73],
      [14, 78],
      [15, 82],
      [16, 80],
      [17, 85],
      [18, 88],
      [19, 85],
      [20, 90],
      [21, 88],
      [22, 92],
      [23, 95],
      [24, 100],
    ],
  },
  "vitalik.eth": {
    timeframe: "1Y",
    points: [
      [0, 2800],
      [1, 2900],
      [2, 3000],
      [3, 2950],
      [4, 3100],
      [5, 3050],
      [6, 3200],
      [7, 3300],
      [8, 3250],
      [9, 3400],
      [10, 3350],
      [11, 3500],
      [12, 3450],
      [13, 3600],
      [14, 3550],
      [15, 3650],
      [16, 3700],
      [17, 3650],
      [18, 3750],
      [19, 3800],
      [20, 3750],
      [21, 3850],
      [22, 3900],
      [23, 3950],
      [24, 4000],
    ],
  },
};

// Mock video data
export const mockVideos: VideoData[] = [
  {
    address: "o0.network",
    timestamp: 1714204800,
    source: require("../assets/videos/1.mp4"),
    stats: ["0.0011 ETH", "12 minted", "0.21$ value"],
  },
  {
    address: "QmYwAPJzv5WwXSNt67UjMG6ZAoyrDUBxLpVTicq2RtiohK",
    timestamp: 1714204800,
    source: require("../assets/videos/2.mp4"),
    stats: ["0.0008 ETH", "18 minted", "0.12$ value"],
  },
  {
    address: "QmXgqAR7K37jY34pWrFJJeEKvLXTulqxrqnY7piektshj7",
    timestamp: 1714204800,
    source: require("../assets/videos/3.mp4"),
    stats: ["0.0022 ETH", "24 minted", "0.35$ value"],
  },
  {
    address: "QmTtJX4xV6JozN9x36dN4ArGhMJ3VknQLZcD9nXBagJyGS",
    timestamp: 1714204800,
    source: require("../assets/videos/4.mp4"),
    stats: ["0.0015 ETH", "16 minted", "0.25$ value"],
  },
  {
    address: "QmRmyAXqbGpPPPV2QE3GrSfZi3JYkiKQVf2uQcpaWx2yv",
    timestamp: 1714204800,
    source: require("../assets/videos/5.mp4"),
    stats: ["0.0009 ETH", "10 minted", "0.18$ value"],
  },
  {
    address: "QmS4ustL54puYsYXGQ8dUBqo6pXZiCt4JD4K3N7SoDoB2D",
    timestamp: 1714204800,
    source: require("../assets/videos/6.mp4"),
    stats: ["0.0014 ETH", "15 minted", "0.22$ value"],
  },
];

// Mock asset data
export const mockAssets: Record<string, AssetData[]> = {
  "o0.network": [
    {
      id: "1",
      address: "0x2FF6a90161E0aBF3e374c7B577d62d1cfE631c5C",
      shortAddress: "0x2FF6a9..1c5C",
      name: "Ethereum",
      symbol: "ETH",
      type: "eth",
      balance: "1.25",
      value: "4,125.00",
      priceUsd: 3300,
      priceChange: 11.3,
      color: "#FFEB3B",
      lastUpdated: "2 hrs ago",
    },
    {
      id: "2",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      shortAddress: "0xA0b869..eB48",
      name: "USD Coin",
      symbol: "USDC",
      type: "usdc",
      balance: "450.00",
      value: "450.00",
      priceUsd: 1,
      priceChange: 0.01,
      color: "#2DB27D",
      lastUpdated: "5 hrs ago",
    },
    {
      id: "3",
      address: "0xdec9f2793e3c17cd26eefb21c4762fa5128e0399",
      shortAddress: "0xdec9f2..0399",
      name: "CryptoPunk #1234",
      symbol: "PUNK",
      type: "nft",
      balance: "1",
      value: "15.5 ETH",
      priceUsd: 51150,
      priceChange: 41.5,
      color: "#4CAF50",
      lastUpdated: "1 day ago",
    },
    {
      id: "4",
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      shortAddress: "0xc02aaa..6cc2",
      name: "Wrapped Ethereum",
      symbol: "WETH",
      type: "weth",
      balance: "2.5",
      value: "8,250.00",
      priceUsd: 3300,
      priceChange: 11.3,
      color: "#CDDC39",
      lastUpdated: "3 hrs ago",
    },
    {
      id: "5",
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      shortAddress: "0x1f9840..f984",
      name: "Uniswap",
      symbol: "UNI",
      type: "token",
      balance: "100",
      value: "560.00",
      priceUsd: 5.6,
      priceChange: 11.3,
      color: "#FFC107",
      lastUpdated: "4 hrs ago",
    },
  ],
  "vitalik.eth": [
    {
      id: "1",
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      shortAddress: "0xd8dA6B..6045",
      name: "Ethereum",
      symbol: "ETH",
      type: "eth",
      balance: "355,000",
      value: "1,171,500,000",
      priceUsd: 3300,
      priceChange: 11.3,
      color: "#FFEB3B",
      lastUpdated: "1 hr ago",
    },
    {
      id: "2",
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      shortAddress: "0x1f9840..f984",
      name: "Uniswap",
      symbol: "UNI",
      type: "token",
      balance: "220,000",
      value: "1,232,000",
      priceUsd: 5.6,
      priceChange: 11.3,
      color: "#FF5722",
      lastUpdated: "3 hrs ago",
    },
    {
      id: "3",
      address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
      shortAddress: "0x7fc665..dae9",
      name: "Aave",
      symbol: "AAVE",
      type: "token",
      balance: "3,000",
      value: "240,000",
      priceUsd: 80,
      priceChange: 11.3,
      color: "#9C27B0",
      lastUpdated: "5 hrs ago",
    },
  ],
};
