import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// Figma Node: 2658:1050 (List Component)
// Styles derived from ItemTop (2601:3548), Item (2601:3543), ItemBottom (2601:3538)

const styles = StyleSheet.create({
  listContainer: {
    // layout_16PJOY
    alignSelf: "stretch",
    borderRadius: 16, // From ItemTop/Bottom
    overflow: "hidden", // Clip children to rounded corners
    marginVertical: 5, // Keep existing margin
  },
  itemContainer: {
    // Common style from layout_9ALHDS (used in all items)
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    gap: 8,
    paddingLeft: 20,
    paddingRight: 8,
    backgroundColor: "rgba(0, 0, 0, 0.08)", // From fill_1X17O9 (second value)
    minHeight: 44, // Estimated height
  },
  itemSeparator: {
    // strokes_IBLCPV (applied between items, not on ItemBottom)
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(94, 94, 94, 0.15)", // Second color from stroke
  },
  itemTop: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  itemBottom: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    // style_P4SVCV
    flex: 1,
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "500", // Approx 510
    color: "#FFFFFF", // fill_YBBY7M
  },
  symbol: {
    // style_89GJPJ
    fontFamily: "System",
    fontSize: 19,
    fontWeight: "500", // Approx 510
    color: "rgba(255, 255, 255, 0.96)", // fill_2G2BWC
    marginLeft: 8, // From gap in itemContainer
    minWidth: 24, // Ensure alignment
    textAlign: "center",
  },
});

interface ListItemProps {
  id: string | number;
  title: string;
  symbol?: string;
  onPress?: () => void;
}

interface ListProps {
  items: ListItemProps[];
}

const ListItem: React.FC<
  ListItemProps & { isTop?: boolean; isBottom?: boolean }
> = ({ title, symbol, onPress, isTop, isBottom }) => {
  const containerStyles = [
    styles.itemContainer,
    isTop && styles.itemTop,
    isBottom && styles.itemBottom,
    !isBottom && styles.itemSeparator, // Apply separator if not the bottom item
  ];

  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      {symbol && <Text style={styles.symbol}>{symbol}</Text>}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyles} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyles}>{content}</View>;
};

export const List: React.FC<ListProps> = ({ items }) => {
  return (
    <View style={styles.listContainer}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          {...item}
          isTop={index === 0}
          isBottom={index === items.length - 1}
        />
      ))}
    </View>
  );
};
