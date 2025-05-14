import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Outbound, Inbound, GloriousButton } from "../components";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  onClose?: () => void;
  isBottomSheet?: boolean;
};

export default function WalletConnectModal({
  onClose,
  isBottomSheet = false,
}: Props) {
  const { connectWallet } = useAuth();

  const handleConnect = async () => {
    try {
      await connectWallet();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
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
        <Inbound style={styles.section}>
          <Text style={styles.sectionTitle}>Available Wallets</Text>

          <TouchableOpacity style={styles.walletOption} onPress={handleConnect}>
            <Text style={styles.walletText}>Telegram Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.walletOption} onPress={handleConnect}>
            <Text style={styles.walletText}>MetaMask</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.walletOption} onPress={handleConnect}>
            <Text style={styles.walletText}>WalletConnect</Text>
          </TouchableOpacity>
        </Inbound>

        <GloriousButton
          title="Connect Wallet"
          onPress={handleConnect}
          style={styles.connectButton}
        />
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
  connectButton: {
    marginTop: 24,
    width: "100%",
  },
});
