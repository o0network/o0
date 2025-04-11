import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  listContainer: {
    alignSelf: "stretch",
    borderRadius: 16, // Outer container for clipping potentially
    overflow: "hidden", // Needed if using background on this container
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 0, 0, 0.08)", // List item background
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(94, 94, 94, 0.15)", // Separator color
    minHeight: 44,
  },
  itemTop: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  itemBottom: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomWidth: 0, // No separator for the last item
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  symbol: {
    fontSize: 19,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.96)",
    marginLeft: 8, // Space between title and symbol
    minWidth: 24, // Ensure alignment
    textAlign: "center",
  },
});

interface ListItemProps {
  id: string | number;
  title: string;
  symbol?: string; // Use string for SF symbols for now
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
