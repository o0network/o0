import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  WALLET_CONNECTED: "walletConnected",
};

export type StorageService = {
  isWalletConnected: () => Promise<boolean>;
  setWalletConnected: (connected: boolean) => Promise<void>;
};

const StorageService: StorageService = {
  isWalletConnected: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(KEYS.WALLET_CONNECTED);
      return value === "true";
    } catch (error) {
      console.error("Error reading wallet status:", error);
      return false;
    }
  },

  setWalletConnected: async (connected: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        KEYS.WALLET_CONNECTED,
        connected ? "true" : "false"
      );
    } catch (error) {
      console.error("Error saving wallet status:", error);
    }
  },
};

export default StorageService;
