import { StyleSheet, View, Image } from "react-native";
import { Button, Frame, Link, Text } from "../components";
import { useAuth } from "../contexts/AuthContext";
import SafeAreaView from "../components/SafeAreaView";
import { usePlatform } from "../contexts/ScreenContext";

export default function SettingsScreen() {
  const { isWalletConnected, disconnectWallet } = useAuth();

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };
  const { isPlatform } = usePlatform();

  return (
    <SafeAreaView
      style={[styles.container, isPlatform("web") && { maxHeight: 0 }]}
    >
      <View style={{flex: 1, width: "100%", paddingHorizontal: 12, marginTop: 12}}>
      <Frame style={styles.storeButtons} borderRadius={0}>
        <Link href="https://o0.network/g" style={styles.storeButton} external>
          <Image
            resizeMode="contain"
            style={{
              width: 48,
              height: 48,
            }}
            source={require("../assets/google-play.png")}
          />
        </Link>
        <Text style={styles.cardTitle}>Download App</Text>
        <Link href="https://o0.network/a" style={styles.storeButton} external>
          <Image
            resizeMode="contain"
            style={{
              width: 48,
              height: 48,
              transform: [{translateX: -8}],
            }}
            source={require("../assets/app-store.png")}
          />
        </Link>
      </Frame>

      {[
        {
          title: "Graypaper",
          url: "https://o0.network/graypaper.pdf",
        },
        {
          title: "Telegram Channel",
          url: "https://t.me/o0network",
        },
        {
          title: "Twitter X",
          url: "https://x.com/o0network",
        },
        {
          title: "Github",
          url: "https://github.com/o0network/o0",
        },
      ].map((item, index) => (
        <Frame key={index} style={styles.card} borderRadius={0}>
          <Link style={styles.cardContent} href={item.url}>
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.url}</Text>
            </View>
            <Image
              style={{width: 24, height: 24}}
              source={require("../assets/emojis/external-link.png")}
            />
          </Link>
        </Frame>
      ))}
      </View>

      <View style={styles.disconnectButton}>
        {isWalletConnected && (
          <Button
            iconPath={require("../assets/emojis/cross-mark.png")}
            title="Disconnect Wallet"
            onPress={handleDisconnectWallet}
          />
         )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 12,
    height: "100%",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 512,
    marginHorizontal: "auto",
  },
  cardsContainer: {
    gap: 6,
    marginBottom: 12,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cardTitle: {
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.23)",
  },
  externalLink: {
    fontSize: 17,
    fontWeight: "600",
  },
  storeButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  storeButton: {
    width: 42,
    height: 42,
  },
  storeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito",
  },
  disconnectButton: {
    marginTop: 24,
    alignSelf: "center",
  },
});
