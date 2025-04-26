import {
  VideoData,
  AssetData,
  mockVideos,
  mockAssets,
  PriceData,
  mockPriceData,
} from "./mocks";

export type { VideoData, AssetData, PriceData };

export const ApiService = {
  // Video-related API methods
  getAllVideos: (): VideoData[] => {
    return mockVideos;
  },

  getVideoByAddress: (address: string): VideoData | undefined => {
    return mockVideos.find((video) => video.address === address);
  },

  getFeaturedVideo: (): VideoData => {
    return mockVideos[0];
  },

  getNextVideo: (currentAddress: string): VideoData => {
    const currentIndex = mockVideos.findIndex(
      (video) => video.address === currentAddress
    );
    const nextIndex = (currentIndex + 1) % mockVideos.length;
    return mockVideos[nextIndex];
  },

  getPreviousVideo: (currentAddress: string): VideoData => {
    const currentIndex = mockVideos.findIndex(
      (video) => video.address === currentAddress
    );
    const prevIndex =
      (currentIndex - 1 + mockVideos.length) % mockVideos.length;
    return mockVideos[prevIndex];
  },

  preloadVideo: async (video: VideoData): Promise<void> => {
    if (!video || !video.source) return;

    try {
      console.log(`Preloading video: ${video.address}`);

      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error("Error preloading video:", error);
    }
  },

  preloadNextVideo: async (currentAddress: string): Promise<void> => {
    const videos = ApiService.getAllVideos();
    const currentIndex = videos.findIndex((v) => v.address === currentAddress);

    if (currentIndex === -1 || currentIndex >= videos.length - 1) return;

    const nextVideo = videos[currentIndex + 1];
    if (nextVideo) {
      await ApiService.preloadVideo(nextVideo);
    }
  },

  // Asset-related API methods
  getAssetsByAddress: (address: string): AssetData[] => {
    return mockAssets[address] || [];
  },

  getAssetById: (address: string, assetId: string): AssetData | undefined => {
    const assets = ApiService.getAssetsByAddress(address);
    return assets.find((asset) => asset.id === assetId);
  },

  getAssetsByType: (address: string, type: string): AssetData[] => {
    const assets = ApiService.getAssetsByAddress(address);
    return assets.filter((asset) => asset.type === type);
  },

  getTotalPortfolioValue: (address: string): string => {
    const assets = ApiService.getAssetsByAddress(address);
    const totalValueUsd = assets.reduce((sum, asset) => {
      const valueNumber = parseFloat(asset.value.replace(/,/g, ""));
      return isNaN(valueNumber) ? sum : sum + valueNumber;
    }, 0);

    return totalValueUsd.toLocaleString();
  },

  getPortfolioPerformance: (address: string): number => {
    const assets = ApiService.getAssetsByAddress(address);
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
  },

  getPriceData: (address: string): PriceData => {
    return mockPriceData[address] || { timeframe: "1M", points: [] };
  },
};

export default ApiService;
