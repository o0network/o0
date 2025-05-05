import { useState } from "react";
import {
  Field,
  Button,
  Checkbox,
  ValueLabel,
  Slider,
  Background,
  Frame,
  Outbound,
  Inbound,
  GloriousButton,
} from "../components";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text } from "../components";

export default function ComponentsScreen() {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [dotIndex, setDotIndex] = useState(3);
  const [bubbleIndex, setBubbleIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <Frame>
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../assets/emojis/money-wings.png")}
        />
      </Frame>
      <Inbound>
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../assets/emojis/money-wings.png")}
        />
      </Inbound>
      <Outbound>
        <Image
          style={{ width: 24, height: 24 }}
          source={require("../assets/emojis/money-wings.png")}
        />
      </Outbound>
      <ScrollView>
        <Outbound style={styles.frameStyle}>
          <Inbound style={styles.card}>
            <Text>Nunito (SemiBold)</Text>
            <Text style={styles.textMono}>DM Mono (Medium)</Text>
            <Text style={styles.textPuff}>DynaPuff (Bold)</Text>
          </Inbound>

          <Inbound style={styles.card}>
            <View style={styles.userInfoRow}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.userInfoText}>
                <Text style={styles.text}>People can make changes</Text>
                <Text style={styles.subText}>Sharing as Jay Moon</Text>
              </View>
              <Text style={styles.grabber}>􀌇</Text>
            </View>
          </Inbound>

          <Field placeholder="Value" style={styles.field} />
          <Field placeholder="Search" style={styles.field} />
          <Field placeholder="Password" secureTextEntry style={styles.field} />

          <TouchableOpacity onPress={() => {}}>
            <Outbound style={styles.button}>
              <Text>Button</Text>
            </Outbound>
          </TouchableOpacity>

          <Inbound style={styles.controlsRow}>
            <Checkbox isChecked={checkboxValue} onToggle={setCheckboxValue} />
            <ValueLabel value={`${Math.round(sliderValue)}%`} />
          </Inbound>

          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            minimumValue={0}
            maximumValue={100}
            style={styles.slider}
          />

          <GloriousButton
            title="Glorious Button"
            onPress={() => {}}
            style={styles.gloriousButton}
          />

          <Inbound style={styles.roundButtonRow}>
            <Button
              iconPath={require("../assets/emojis/compass.png")}
              title="Pill Button"
              onPress={() => {}}
              style={styles.pillButton}
            />
          </Inbound>
        </Outbound>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
  },
  frameStyle: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginRight: 8,
  },
  userInfoText: {
    flex: 1,
  },
  grabber: {
    color: "#545454",
    fontSize: 17,
    fontWeight: "500",
  },
  text: {
    fontSize: 17,
    marginBottom: 4,
  },
  textMono: {
    fontSize: 17,
    fontFamily: "DMMono_500Medium",
    fontWeight: "500",
    marginBottom: 4,
  },
  textPuff: {
    fontSize: 17,
    fontFamily: "DynaPuff_700Bold",
    fontWeight: "700",
  },
  subText: {
    fontSize: 13,
    color: "#a0a0a0",
    fontWeight: "500",
  },
  field: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
  },
  slider: {
    marginBottom: 16,
  },
  dotSelectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  roundButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
  pillButton: {
    minWidth: 44,
    paddingHorizontal: 12,
  },
  gloriousButton: {
    marginVertical: 16,
    paddingVertical: 12,
    minHeight: 54,
  },
});
