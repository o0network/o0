import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Outbound, Inbound, GloriousButton } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

type Props = {
  onClose?: () => void;
  isBottomSheet?: boolean;
};

export default function WalletConnectModal({
  onClose,
  isBottomSheet = false,
}: Props) {
  const { connectWallet, disconnectWallet, isWalletConnected, walletAddress } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const ScrollViewComponent = isBottomSheet
    ? require("@gorhom/bottom-sheet").BottomSheetScrollView
    : ScrollView;

  return (
    <Outbound style={styles.container}>
      {isBottomSheet && <View style={styles.grabber} />}
      <ScrollViewComponent
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Wallet Connection</Text>

        {isWalletConnected ? (
          <Inbound style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Wallet</Text>
            <Text style={styles.walletAddress}>{walletAddress}</Text>
            <GloriousButton
              style={styles.connectButton}
              onPress={handleDisconnect}
              title="Disconnect Wallet"
            />
          </Inbound>
        ) : (
          <Inbound style={styles.section}>
            <Text style={styles.sectionTitle}>Connect a Wallet</Text>
            <TouchableOpacity style={styles.walletOption} onPress={handleConnect}>
              <Text style={styles.walletText}>MetaMask</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletOption} onPress={handleConnect}>
              <Text style={styles.walletText}>WalletConnect</Text>
            </TouchableOpacity>
            <GloriousButton
              style={styles.connectButton}
              onPress={handleConnect}
              title={isConnecting ? "Connecting..." : "Connect Wallet"}
            />
            {isConnecting && (
              <ActivityIndicator style={styles.loader} color="#FFFFFF" />
            )}
          </Inbound>
        )}
      </ScrollViewComponent>
    </Outbound>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    width: "100%",
    height: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignSelf: "center",
    marginTop: 10,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  walletOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
  },
  walletText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  walletAddress: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.7,
    marginBottom: 16,
    fontFamily: "DMMono_500Medium",
  },
  connectButton: {
    marginTop: 24,
    width: "100%",
  },
  loader: {
    marginTop: 16,
  },
});
