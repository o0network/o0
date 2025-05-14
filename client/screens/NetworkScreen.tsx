import { StyleSheet, ScrollView, View } from "react-native";
import Text from "../components/Text";
import { Outbound, Inbound, Button, SafeAreaView } from "../components";
import { useModal } from "../contexts/ModalContext";
import { usePlatform } from "../contexts/ScreenContext";

type Proposal = {
  key: string;
  title: string;
  description: string;
  percentage: number;
};

const proposals: Proposal[] = [
  {
    key: "1",
    title: "Remote Work Initiative",
    description:
      "Assess feasibility and benefits of remote work to boost productivity.",
    percentage: 72,
  },
  {
    key: "2",
    title: "Renewable Energy Adoption",
    description:
      "Evaluate renewable energy solutions for sustainability and cost savings.",
    percentage: 85,
  },
  {
    key: "3",
    title: "Employee Benefits Upgrade",
    description:
      "Upgrade health, wellness, and educational benefits for staff retention.",
    percentage: 35,
  },
  {
    key: "4",
    title: "International Expansion",
    description:
      "Research extending services to international markets responsibly.",
    percentage: 60,
  },
  {
    key: "5",
    title: "Sustainability Projects",
    description:
      "Explore waste reduction, recycling, and eco-friendly product development.",
    percentage: 90,
  },
];

export default function NetworkScreen() {
  const { openPreferences } = useModal();
  const { isPlatform } = usePlatform();
  const showSettings = !isPlatform("telegram");

  return (
    <SafeAreaView
      style={[styles.screen, isPlatform("web") && { marginTop: 70 }]}
    >
      <Outbound style={styles.container}>
        <Text style={styles.title}>DAO Governance</Text>
        <Text style={styles.subtitle}>
          Use your votes to shape our future. Your balance reflects your voting
          power; no tokens are withdrawn.
        </Text>

        <Inbound style={styles.listWrapper}>
          <ScrollView style={styles.scrollView}>
            {proposals.map((p) => (
              <Outbound key={p.key} style={styles.card}>
                <Text style={styles.cardTitle}>{p.title}</Text>
                <Text style={styles.cardDesc}>{p.description}</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.percText}>{p.percentage}%</Text>
                  <Text style={styles.percText}>{100 - p.percentage}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.processApprove, { flex: p.percentage }]}
                  />
                  <View
                    style={[styles.processReject, { flex: 100 - p.percentage }]}
                  />
                </View>
                <View style={styles.buttonsRow}>
                  <Button
                    title="Approve"
                    textStyle={{ color: "#FFFFFF" }}
                    iconPath={require("../assets/emojis/check-mark.png")}
                  />
                  <Button
                    title="Reject"
                    textStyle={{ color: "#FFFFFF" }}
                    iconPath={require("../assets/emojis/cross-mark.png")}
                  />
                </View>
              </Outbound>
            ))}
          </ScrollView>
        </Inbound>

        {showSettings && (
          <Button title="Open Preferences" onPress={openPreferences} />
        )}
      </Outbound>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    maxWidth: 512,
    marginHorizontal: "auto",
    marginBottom: 12,
  },
  container: {
    padding: 16,
    gap: 16,
    flex: 1,
    margin: 12,
    justifyContent: "flex-start",
  },
  scrollView: { paddingHorizontal: 12, flex: 1 },
  title: { fontSize: 20, fontWeight: "600", color: "#FFFFFF" },
  subtitle: { fontSize: 14, color: "#FFFFFF", lineHeight: 18 },
  listWrapper: { paddingVertical: 12, flex: 1, overflow: "hidden" },
  card: {
    flex: 1,
    width: "100%",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    width: "100%",
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardDesc: {
    width: "100%",
    fontSize: 12,
    color: "#FFFFFF",
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  buttonsRow: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
    marginTop: 8,
  },
  percText: { fontSize: 14, color: "#FFFFFF" },
  progressBar: {
    height: 8,
    width: "100%",
    flexDirection: "row",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 6,
  },
  processApprove: {
    backgroundColor: "rgb(0, 255, 0)",
  },
  processReject: {
    backgroundColor: "rgb(255, 0, 0)",
  },
});
