export type VideoData = {
  address: string;
  source?: string;
  thumbnailUrl?: string;
  discussion?: string;
  stats?: {
    price: string;
    minted: string;
    value: string;
  };
  [key: string]: any;
};

export type AssetData = {
  id: string;
  type: string;
  value: string;
  priceChange: number;
  discussion?: string;
  price?: string;
  minted?: string;
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

export type VideoSubmissionResult = {
  success: boolean;
  message: string;
  address?: string;
  error?: string;
};

export type VideoStatusResult = {
  status: "pending" | "approved" | "rejected";
  message: string;
};

// In React Native, __DEV__ is a global variable set to true in development.
// process.env.NODE_ENV might not be reliably set by all RN bundlers/environments for this check.
// window.location.hostname is not applicable in React Native.
export const API_URL =
  __DEV__ &&
  !(
    typeof window !== "undefined" &&
    window.location &&
    window.location.hostname === "dev.o0.network"
  )
    ? "http://localhost:5555"
    : "https://o0.network";

export const ApiService = {
  fetchVideos: async (limit = 9, offset = 0): Promise<VideoData[]> => {
    try {
      const response = await fetch(`${API_URL}/api/videos/next?limit=${limit}&threshold=${offset}`);

      if (response.status === 404) {
        return [];
      }

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

      if (result && result.data && Array.isArray(result.data)) {
        return result.data;
      }

      if (result && Array.isArray(result.videos)) {
        return result.videos;
      }

      if (result && result.items && Array.isArray(result.items)) {
        return result.items;
      }

      if (!result || Object.keys(result).length === 0 || (result.data && result.data.length === 0)) {
        return [];
      }

      if (typeof result === 'object' && result !== null && !Array.isArray(result)) {
        console.warn("Fetched videos result is a single object, expected array:", result);
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
      // Skip calling the API for obviously invalid addresses
      if (!address || address === "select an item first" || address.includes("%20")) {
        console.warn("Invalid address format, skipping API call");
        return [];
      }

      const response = await fetch(`${API_URL}/api/assets/${address}`);

      // Handle 400 Bad Request (invalid address)
      if (response.status === 400) {
        console.warn(`Invalid address format: ${address}`);
        return [];
      }

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
      // Skip calling the API for obviously invalid addresses
      if (!address || address === "select an item first" || address.includes("%20")) {
        console.warn("Invalid address format for price data, returning empty data");
        return { timeframe: "1M", points: [] };
      }

      const response = await fetch(`${API_URL}/api/price/${address}`);
      if (!response.ok) throw new Error("Failed to fetch price data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching price data:", error);
      return { timeframe: "1M", points: [] };
    }
  },

  getPitchPriceData: async (pitchAddress: string): Promise<PriceData> => {
    try {
      // Skip calling the API for obviously invalid addresses
      if (!pitchAddress || pitchAddress === "select an item first" || pitchAddress.includes("%20")) {
        console.warn("Invalid pitch address format, returning empty price data");
        return { timeframe: "1M", points: [] };
      }

      const response = await fetch(
        `${API_URL}/api/pitch/${pitchAddress}/price`
      );
      if (!response.ok) throw new Error("Failed to fetch pitch price data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching pitch price data:", error);
      return { timeframe: "1M", points: [] }; // Default empty response on error
    }
  },

  submitVideo: async (
    videoUri: string,
    userId: string,
    title?: string
  ): Promise<VideoSubmissionResult> => {
    try {
      const formData = new FormData();

      // Add the video file
      const uriParts = videoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("video", {
        uri: videoUri,
        name: `video.${fileType}`,
        type: `video/${fileType}`,
      } as any);

      // Add metadata
      formData.append("userId", userId);
      if (title) {
        formData.append("title", title);
      }

      const response = await fetch(`${API_URL}/api/videos/submit`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.error || "Failed to submit video",
          error: result.error,
        };
      }

      return {
        success: true,
        message: result.message || "Video submitted successfully",
        address: result.address,
      };
    } catch (error) {
      console.error("Error submitting video:", error);
      return {
        success: false,
        message: "Network error while submitting video",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },

  checkVideoStatus: async (address: string): Promise<VideoStatusResult> => {
    try {
      const response = await fetch(`${API_URL}/api/videos/status/${address}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check video status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking video status:", error);
      throw error;
    }
  },
};

export default ApiService;
