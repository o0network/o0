import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

interface ContactItemProps {
  name: string;
  imageSource: ImageSourcePropType;
}

const ContactItem: React.FC<ContactItemProps> = ({ name, imageSource }) => {
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.avatarImage} />
      <Text style={styles.nameText} numberOfLines={2} ellipsizeMode="tail">
        {name}
      </Text>
    </View>
  );
};

// Styles based on Figma nodes like _Contact (e.g., 2601:3652)
const styles = StyleSheet.create({
  container: {
    // layout_JIG972: mode: column, alignItems: center, gap: 4px, padding: 8px
    alignItems: "center",
    gap: 4,
    padding: 8,
    borderRadius: 16, // borderRadius: 16px
    width: 84, // dimensions: width: 84
    // Background fill varies (e.g., fill_E21PUK), maybe keep it transparent or add a subtle default?
    // backgroundColor: 'rgba(255, 255, 255, 0.06)', // Example from fill_E21PUK
  },
  avatarImage: {
    // Based on Avatar Image nodes (e.g., 2601:3653)
    width: 60, // Assuming a fixed size based on parent width 84 and padding 8
    height: 60,
    borderRadius: 100, // borderRadius: 100px
    // Image content set by source prop
  },
  nameText: {
    // style_FHVZVM
    fontFamily: "SF Pro",
    fontWeight: "500", // 510 approx
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.96)", // fill_EWMT4L
    textAlign: "center", // textAlignHorizontal: CENTER
    // lineHeight: 1.38 em - Handled by RN
    // layout_3YFGH6: sizing: horizontal: fill (within the 84 width)
    width: "100%",
  },
});

export default ContactItem;
