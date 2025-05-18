import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isWalletConnected: boolean;
  connectWallet: () => Promise<string | void>;
  disconnectWallet: () => void;
  walletAddress: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  isWalletConnected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  walletAddress: null,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAddress = "0x" + Math.random().toString(16).slice(2, 42);
      setWalletAddress(mockAddress);
      setIsWalletConnected(true);

      return mockAddress;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isWalletConnected,
        connectWallet,
        disconnectWallet,
        walletAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
