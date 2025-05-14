import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { Outbound, Inbound, GloriousButton } from "../components";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  onClose?: () => void;
  isBottomSheet?: boolean;
};

export default function PreferencesModal({
  onClose,
  isBottomSheet = false,
}: Props) {
  const { isWalletConnected, disconnectWallet } = useAuth();

  const handleDisconnectWallet = () => {
    disconnectWallet();
    if (onClose) onClose();
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
        <View style={styles.cardsContainer}>
          <Inbound style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Download App</Text>
              <View style={styles.storeButtons}>
                <TouchableOpacity
                  style={styles.storeButton}
                  onPress={() => Linking.openURL("https://apps.apple.com")}
                >
                  <Text style={styles.storeButtonText}>App Store</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.storeButton}
                  onPress={() => Linking.openURL("https://play.google.com")}
                >
                  <Text style={styles.storeButtonText}>Google Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Inbound>

          <Inbound style={styles.card}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() =>
                Linking.openURL("https://o0.network/graypaper.pdf")
              }
            >
              <View style={styles.graypaper}>
                <View>
                  <Text style={styles.cardTitle}>Graypaper</Text>
                  <Text style={styles.cardSubtitle}>
                    https://o0.network/graypaper.pdf
                  </Text>
                </View>
                <Text style={styles.externalLink}>↗</Text>
              </View>
            </TouchableOpacity>
          </Inbound>
        </View>

        {isWalletConnected && (
          <GloriousButton
            title="Disconnect Wallet"
            iconPath={require("../assets/emojis/prohibited.png")}
            onPress={handleDisconnectWallet}
            style={styles.disconnectButton}
          />
        )}
      </ScrollViewComponent>
    </Outbound>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    gap: 12,
    height: "100%",
    width: "100%",
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignSelf: "center",
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
    width: "100%",
  },
  cardsContainer: {
    gap: 6,
    marginBottom: 12,
    width: "100%",
  },
  card: {
    padding: 8,
    borderRadius: 16,
    width: "100%",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.23)",
    fontWeight: "600",
  },
  externalLink: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.23)",
    fontWeight: "600",
  },
  graypaper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  storeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  storeButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  storeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  disconnectButton: {
    marginTop: 12,
    width: "100%",
  },
});
