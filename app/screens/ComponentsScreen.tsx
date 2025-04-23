import { useState } from "react";
import {
  Card,
  Field,
  Gallery,
  Button,
  List,
  Switch,
  Checkbox,
  ValueLabel,
  Slider,
  DotSelector,
  BubbleBar,
  Background,
} from "../components";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Text } from "../App";
import { Frame } from "../components";

export default function ComponentsScreen() {
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const [dotIndex, setDotIndex] = useState(3);
  const [bubbleIndex, setBubbleIndex] = useState(0);

  const galleryItems = [
    { id: "1", name: "One", avatar: "👤" },
    { id: "2", name: "Two", avatar: "👤" },
    { id: "3", name: "Three", avatar: "👤" },
    { id: "4", name: "Four", avatar: "👤" },
  ];

  const listItems = [
    { id: "1", title: "One", symbol: "🖨️" },
    { id: "2", title: "Two", symbol: "🖨️" },
    { id: "3", title: "Three", symbol: "🖨️" },
  ];

  const cellGridColors = [
    ["#FEFFFE", "#EBEBEB", "#D6D6D6"],
    ["#C2C2C2", "#ADADAD", "#707070"],
    ["#FEFFFE", "#EBEBEB", "#D6D6D6"],
  ];

  const bubbleItems = [
    { label: "Map", icon: "🗺️" },
    { label: "List", icon: "📃" },
  ];

  const dotOptions = [
    { color: "#000000" },
    { color: "#007AFF" },
    { color: "#34C759" },
    { color: "#FF4015" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Frame style={styles.frameStyle}>
          <Card style={styles.card}>
            <Text>Nunito (SemiBold)</Text>
            <Text style={styles.textMono}>DM Mono (Medium)</Text>
            <Text style={styles.textPuff}>DynaPuff (Bold)</Text>
          </Card>

          <Card style={styles.card}>
            <View style={styles.userInfoRow}>
              <View style={styles.avatarPlaceholder} />
              <View style={styles.userInfoText}>
                <Text style={styles.text}>People can make changes</Text>
                <Text style={styles.subText}>Sharing as Jay Moon</Text>
              </View>
              <Text style={styles.grabber}>􀌇</Text>
            </View>
          </Card>

          <Gallery items={galleryItems} selectedId="1" />

          <Field placeholder="Value" style={styles.field} />
          <Field placeholder="Search" style={styles.field} />
          <Field placeholder="Password" secureTextEntry style={styles.field} />

          <Button
            title="Button"
            icon="😸"
            onPress={() => {}}
            style={styles.button}
          />

          <List items={listItems} />

          <View style={styles.controlsRow}>
            <Switch value={switchValue} onValueChange={setSwitchValue} />
            <Checkbox isChecked={checkboxValue} onToggle={setCheckboxValue} />
            <ValueLabel value={`${Math.round(sliderValue)}%`} />
          </View>

          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            minimumValue={0}
            maximumValue={100}
            style={styles.slider}
          />

          <View style={styles.dotSelectorContainer}>
            <DotSelector
              options={dotOptions.map((opt, index) => ({
                ...opt,
                selected: index === dotIndex,
                onSelect: () => setDotIndex(index),
              }))}
              showAddButton={true}
              onAddPress={() => console.log("Add dot pressed")}
            />
          </View>

          <BubbleBar
            items={bubbleItems}
            selectedIndex={bubbleIndex}
            onSelectIndex={setBubbleIndex}
            style={styles.bubbleBar}
          />

          <View style={styles.roundButtonRow}>
            <Button
              icon="⚙️"
              title=""
              onPress={() => {}}
              style={styles.pillButton}
            />
          </View>

          <View style={styles.gloriousButtonPlaceholder}>
            <Text style={styles.text}>Glorious Button Placeholder</Text>
          </View>
        </Frame>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
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
  bubbleBar: {
    marginVertical: 8,
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
  gloriousButtonPlaceholder: {
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
