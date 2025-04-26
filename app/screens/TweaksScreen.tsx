import { useState } from "react";
import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import { Toggle, Button, Inbound, Outbound } from "../components";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Components: undefined;
  Main: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProposalCardProps {
  title: string;
  description: string;
  percentage: number;
  status: "voting" | "approved" | "rejected";
}

const proposalData: {
  key: string;
  title: string;
  description: string;
  percentage: number;
  status: "voting" | "approved" | "rejected";
}[] = [
  {
    key: "fae3bb34-34a1-4d15-af46-5e0d7fc9cbb4",
    title: "Which remote work project should we support?",
    description:
      "A survey to assess the feasibility and potential benefits of a remote work initiative aimed at enhancing work-life balance and boosting productivity.",
    percentage: 72,
    status: "voting",
  },
  {
    key: "72f7cd00-30f2-4a14-bb7f-ea3eb6c0a2f8",
    title: "Which renewable energy project should we support?",
    description:
      "A survey to evaluate the integration of renewable energy solutions to reduce operational costs and promote sustainability.",
    percentage: 85,
    status: "approved",
  },
  {
    key: "2b895eed-4286-4f11-8967-3457d25cd0b9",
    title: "Which employee benefits project should we support?",
    description:
      "Assessing proposals to upgrade health, wellness, and educational benefits for improved employee satisfaction and retention.",
    percentage: 35,
    status: "rejected",
  },
  {
    key: "b75b1977-8b8b-4a0a-bbca-52762c30a2fd",
    title: "Which international expansion project should we support?",
    description:
      "A market research survey exploring initiatives for extending our services to international markets while balancing benefits and challenges.",
    percentage: 60,
    status: "voting",
  },
  {
    key: "c1234567-89ab-cdef-0123-456789abcdef",
    title: "Which sustainability project should we support?",
    description:
      "Investigating potential projects focused on waste reduction, recycling, and sustainable product development.",
    percentage: 90,
    status: "approved",
  },
];

const ProposalCard: React.FC<ProposalCardProps> = ({
  title,
  description,
  percentage,
  status,
}) => {
  return (
    <Inbound style={styles.proposalCard}>
      <Text style={styles.proposalTitle}>{title}</Text>
      <Text style={styles.proposalDescription}>{description}</Text>

      <View style={styles.votingStats}>
        <View style={styles.percentageRow}>
          <View style={styles.yesPercentageContainer}>
            <Text style={styles.percentageText}>{`${percentage}%`}</Text>
          </View>
          <Text style={styles.percentageText}>{`${100 - percentage}%`}</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressYes, { flex: percentage / 100 }]} />
          <View
            style={[styles.progressNo, { flex: (100 - percentage) / 100 }]}
          />
        </View>
      </View>

      {status === "voting" ? (
        <View style={styles.votingButtons}>
          <Button
            title="Yes"
            icon="✅"
            onPress={() => console.log("Voted Yes")}
            style={styles.voteButton}
          />
          <Button
            title="No"
            icon="🚫"
            onPress={() => console.log("Voted No")}
            style={styles.voteButton}
          />
        </View>
      ) : (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Approved</Text>
        </View>
      )}
    </Inbound>
  );
};

const TweaksScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Inbound style={styles.settingsCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Reduced motion</Text>
            <Toggle value={reducedMotion} onValueChange={setReducedMotion} />
          </View>

          <Button
            title="Disconnect Wallet"
            icon="🔐"
            onPress={() => {
              console.log("Disconnect wallet pressed");
            }}
            style={styles.disconnectButton}
          />

          <Button
            title="Open Components"
            icon="🪣"
            onPress={() => {
              navigation.navigate("Components");
            }}
          />
        </Inbound>

        <Outbound style={styles.governanceCard}>
          <View style={styles.governanceHeader}>
            <Text style={styles.governanceTitle}>DAO Governance</Text>
            <Text style={styles.governanceDescription}>
              Use your votes as a decision making power to shape the future
              we'll build. Your balance reflects your voting power, we don't
              withdraw any tokens from your balance. Feel free to vote.
            </Text>
          </View>

          <Inbound style={styles.proposalsContainer}>
            <ScrollView>
              {proposalData.map((p) => (
                <ProposalCard
                  key={p.key}
                  title={p.title}
                  description={p.description}
                  percentage={p.percentage}
                  status={p.status}
                />
              ))}
            </ScrollView>
          </Inbound>
        </Outbound>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  settingsCard: {
    borderRadius: 16,
    padding: 12,
    gap: 16,
    width: "100%",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  disconnectButton: {
    borderRadius: 999,
    alignSelf: "stretch",
  },
  governanceCard: {
    borderRadius: 16,
    height: 580,
    overflow: "hidden",
  },
  governanceHeader: {
    padding: 12,
    gap: 4,
  },
  governanceTitle: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 19.2,
  },
  governanceDescription: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 14.4,
  },
  proposalsContainer: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
  },
  proposalCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  proposalTitle: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  proposalDescription: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    lineHeight: 14.4,
  },
  votingStats: {
    gap: 2,
    width: "100%",
  },
  percentageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  yesPercentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
  },
  percentageText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  progressBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "rgba(208, 208, 208, 0.5)",
  },
  progressYes: {
    backgroundColor: "rgba(0, 255, 81, 0.8)",
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
  progressNo: {
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  votingButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    opacity: 0.8,
  },
  voteButton: {
    flex: 1,
    borderRadius: 20,
  },
  statusBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  statusText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.96)",
    fontWeight: "600",
  },
});

export default TweaksScreen;
