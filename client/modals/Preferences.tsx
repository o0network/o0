import { StyleSheet, View, Text, ScrollView } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Button } from "../components";

type Props = {
  onClose?: () => void;
};

export default function PreferencesModal({ onClose }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Preferences</Text>
      </View>
      <BottomSheetScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <View style={styles.option}>
          <Text style={styles.optionText}>Dark Mode</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Notifications</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Language</Text>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.option}>
          <Text style={styles.optionText}>Profile</Text>
        </View>

        <View style={styles.option}>
          <Text style={styles.optionText}>Security</Text>
        </View>

        {onClose && (
          <Button title="Close" onPress={onClose} style={styles.closeButton} />
        )}
      </BottomSheetScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(20, 20, 20, 0.9)",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  option: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  closeButton: {
    marginTop: 24,
  },
});
