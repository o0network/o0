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
  address: string;
  stat: {
    value: number;
    valuation: number;
    price: number;
    minted: number;
  };
  discussion: string;
  price: number[];
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

export const API_URL =  window.location.hostname === "dev.o0.network"
    ? "https://dev.o0.network" :
    __DEV__ ? "http://localhost:5555"
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
      const response = await fetch(`${API_URL}/api/ledger`, {
        headers: {
          'Authorization': `User ${address}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.warn(`Unauthorized request for address: ${address}`);
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
    console.log(`ApiService.submitVideo called with: videoUri=${videoUri}, userId=${userId}, title=${title}`);
    try {
      const formData = new FormData();

      const uriParts = videoUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const fileName = `video.${fileType}`;
      console.log(`ApiService.submitVideo: Preparing video file - name: ${fileName}, type: video/${fileType}`);

      formData.append("video", {
        uri: videoUri,
        name: fileName,
        type: `video/${fileType}`,
      } as any);

      formData.append("userId", userId);
      if (title) {
        formData.append("title", title);
      }
      console.log("ApiService.submitVideo: FormData prepared:", formData);

      const response = await fetch(`${API_URL}/api/videos/submit`, {
        method: "POST",
        body: formData,
        // headers: { // fetch typically sets this correctly for FormData
        //   "Content-Type": "multipart/form-data",
        // },
      });
      console.log("ApiService.submitVideo: Response status:", response.status);
      const result = await response.json();
      console.log("ApiService.submitVideo: Response JSON:", result);

      if (!response.ok) {
        console.error("ApiService.submitVideo: Submission failed with response:", result);
        return {
          success: false,
          message: result.error || "Failed to submit video",
          error: result.error,
        };
      }

      console.log("ApiService.submitVideo: Submission successful:", result);
      return {
        success: true,
        message: result.message || "Video uploaded successfully",
        address: result.address,
      };
    } catch (error) {
      console.error("ApiService.submitVideo: Network error or other exception:", error);
      return {
        success: false,
        message: "Network error while submitting video",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },

  submitVideoBlob: async (
    videoBlob: Blob,
    userId: string,
    title?: string
  ): Promise<VideoSubmissionResult> => {
    console.log(`ApiService.submitVideoBlob called with: blob size=${videoBlob.size}, type=${videoBlob.type}, userId=${userId}, title=${title}`);
    try {
      const formData = new FormData();

      // Determine filename extension based on the MIME type
      let fileExtension = '.webm';
      if (videoBlob.type.includes('mp4')) {
        fileExtension = '.mp4';
      }

      const fileName = `video${fileExtension}`;
      console.log(`ApiService.submitVideoBlob: Preparing video blob - name: ${fileName}, type: ${videoBlob.type}`);

      // Add the video blob with explicit filename and type
      formData.append("video", videoBlob, fileName);
      formData.append("userId", userId);
      if (title) {
        formData.append("title", title);
      }

      // Log all FormData entries for debugging
      for (const pair of (formData as any).entries()) {
        console.log(`FormData contains: ${pair[0]}, ${typeof pair[1] === 'object' ? 'Blob/File' : pair[1]}`);
      }

      console.log(`ApiService.submitVideoBlob: Sending to ${API_URL}/api/videos/submit`);
      const response = await fetch(`${API_URL}/api/videos/submit`, {
        method: "POST",
        body: formData,
      });

      console.log("ApiService.submitVideoBlob: Response status:", response.status);

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorData = await response.json();
          errorDetail = JSON.stringify(errorData);
        } catch (e) {
          errorDetail = await response.text();
        }

        console.error(`ApiService.submitVideoBlob: Server error (${response.status}): ${errorDetail}`);

        if (response.status === 413) {
          return {
            success: false,
            message: "Video file too large. Please record a shorter video.",
            error: "Request Entity Too Large"
          };
        }

        return {
          success: false,
          message: `Upload failed with status ${response.status}: ${errorDetail || response.statusText}`,
          error: errorDetail,
        };
      }

      const result = await response.json();
      console.log("ApiService.submitVideoBlob: Response JSON:", result);

      return {
        success: true,
        message: result.message || "Video uploaded successfully",
        address: result.address,
      };
    } catch (error) {
      console.error("ApiService.submitVideoBlob: Network error or other exception:", error);
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

  getVideoInfo: async (address: string): Promise<VideoData | null> => {
    try {
      if (!address || address === "select an item first" || address.includes("%20")) {
        console.warn("Invalid address format for video info");
        return null;
      }

      const response = await fetch(`${API_URL}/api/video/${address}/info`);

      if (response.status === 404) {
        console.warn(`Video not found: ${address}`);
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch video info");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching video info:", error);
      return null;
    }
  },

  getAssetInfo: async (address: string): Promise<AssetData | null> => {
    try {
      if (!address || address === "select an item first" || address.includes("%20")) {
        console.warn("Invalid address format for asset info");
        return null;
      }

      const response = await fetch(`${API_URL}/api/asset/${address}/info`);

      if (response.status === 404) {
        console.warn(`Asset not found: ${address}`);
        return null;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch asset info");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching asset info:", error);
      return null;
    }
  },
};

export default ApiService;