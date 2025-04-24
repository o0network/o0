import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, SafeAreaView } from "react-native";
import { Toggle, Button, Inbound, Outbound } from "../components";

interface ProposalCardProps {
  title: string;
  description: string;
  percentage: number;
  status: "voting" | "approved" | "rejected";
}

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
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Inbound style={styles.settingsCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Reduced motion</Text>
            <Toggle isOn={reducedMotion} onToggle={setReducedMotion} />
          </View>

          <Button
            title="Disconnect Wallet"
            icon="🔐"
            onPress={() => {
              console.log("Disconnect wallet pressed");
            }}
            style={styles.disconnectButton}
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
              <ProposalCard
                title="Should we support gamble projects?"
                description="This refers to applications centered on gambling, including online casinos, sports betting platforms, poker apps, or lottery systems, which involve real-money wagering and chance-based outcomes."
                yesPercentage={67}
                noPercentage={33}
                status="voting"
              />

              <ProposalCard
                title="Should we support gamble projects?"
                description="This refers to applications centered on gambling, including online casinos, sports betting platforms, poker apps, or lottery systems, which involve real-money wagering and chance-based outcomes."
                yesPercentage={67}
                noPercentage={33}
                status="approved"
              />

              <ProposalCard
                title="Should we support gamble projects?"
                description="This refers to applications centered on gambling, including online casinos, sports betting platforms, poker apps, or lottery systems, which involve real-money wagering and chance-based outcomes."
                yesPercentage={67}
                noPercentage={33}
                status="approved"
              />
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
