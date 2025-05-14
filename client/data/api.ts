export type VideoData = {
  address: string;
  source?: string;
  thumbnailUrl?: string;
  [key: string]: any;
};

export type AssetData = {
  id: string;
  type: string;
  value: string;
  priceChange: number;
  [key: string]: any;
};

export type PriceDataPoint = {
  timestamp: number;
  value: number;
};

export type PriceData = {
  timeframe: string;
  points: PriceDataPoint[];
  [key: string]: any;
};

export const API_URL =
  process.env.NODE_ENV !== "development" ||
  window.location.hostname === "dev.o0.network"
    ? "https://o0.network"
    : "http://localhost:5555";

export const ApiService = {
  fetchVideos: async (limit = 9): Promise<VideoData[]> => {
    try {
      const response = await fetch(`${API_URL}/api/explore?amount=${limit}`);
      if (!response.ok) {
        console.warn(
          `Failed to fetch videos: ${response.status} ${response.statusText}`
        );
        return [];
      }

      const result = await response.json();

      if (Array.isArray(result)) {
        return result;
      }

      // Handle legacy format or empty responses
      if (!result || (result.data && result.data.length === 0)) {
        console.log("Server returned no videos");
        return [];
      }

      return result.data || [];
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  },

  getAssetsByAddress: async (address: string): Promise<AssetData[]> => {
    try {
      const response = await fetch(`${API_URL}/api/assets/${address}`);
      if (!response.ok) throw new Error("Failed to fetch assets");
      return await response.json();
    } catch (error) {
      console.error("Error fetching assets:", error);
      return [];
    }
  },

  getAssetById: async (
    address: string,
    assetId: string
  ): Promise<AssetData | undefined> => {
    try {
      const assets = await ApiService.getAssetsByAddress(address);
      return assets.find((asset) => asset.id === assetId);
    } catch (error) {
      console.error("Error fetching asset by ID:", error);
      return undefined;
    }
  },

  getAssetsByType: async (
    address: string,
    type: string
  ): Promise<AssetData[]> => {
    try {
      const assets = await ApiService.getAssetsByAddress(address);
      return assets.filter((asset) => asset.type === type);
    } catch (error) {
      console.error("Error fetching assets by type:", error);
      return [];
    }
  },

  getTotalPortfolioValue: async (address: string): Promise<string> => {
    try {
      const assets = await ApiService.getAssetsByAddress(address);
      const totalValueUsd = assets.reduce((sum, asset) => {
        const valueNumber = parseFloat(asset.value.replace(/,/g, ""));
        return isNaN(valueNumber) ? sum : sum + valueNumber;
      }, 0);

      return totalValueUsd.toLocaleString();
    } catch (error) {
      console.error("Error calculating portfolio value:", error);
      return "0";
    }
  },

  getPortfolioPerformance: async (address: string): Promise<number> => {
    try {
      const assets = await ApiService.getAssetsByAddress(address);
      let totalValue = 0;
      let totalWeightedChange = 0;

      assets.forEach((asset) => {
        const valueNumber = parseFloat(asset.value.replace(/,/g, ""));
        if (!isNaN(valueNumber)) {
          totalValue += valueNumber;
          totalWeightedChange += valueNumber * asset.priceChange;
        }
      });

      return totalValue > 0 ? totalWeightedChange / totalValue : 0;
    } catch (error) {
      console.error("Error calculating portfolio performance:", error);
      return 0;
    }
  },

  getPriceData: async (address: string): Promise<PriceData> => {
    try {
      const response = await fetch(`${API_URL}/api/price/${address}`);
      if (!response.ok) throw new Error("Failed to fetch price data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching price data:", error);
      return { timeframe: "1M", points: [] };
    }
  },
};

export default ApiService;
