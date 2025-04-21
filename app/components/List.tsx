import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Figma Node: 2658:1050 (List Component)
// Styles derived from ItemTop (2601:3548), Item (2601:3543), ItemBottom (2601:3538)

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 12,
    backgroundColor: "rgba(60, 60, 67, 0.3)",
    minHeight: 44,
  },
  itemSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(84, 84, 88, 0.65)",
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
    flex: 1,
    fontSize: 17,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  iconContainer: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});

interface ListItemProps {
  id: string | number;
  title: string;
  symbol?: string;
  iconName?: string;
  onPress?: () => void;
}

interface ListProps {
  items: ListItemProps[];
}

// Map common SF Symbols to Ionicons names
const symbolToIconMap: Record<string, string> = {
  "􀉁": "copy-outline",
  "􀎚": "print-outline",
  "􀐇": "duplicate-outline",
};

const ListItem: React.FC<
  ListItemProps & { isTop?: boolean; isBottom?: boolean }
> = ({ title, symbol, iconName, onPress, isTop, isBottom }) => {
  const containerStyles = [
    styles.itemContainer,
    isTop && styles.itemTop,
    isBottom && styles.itemBottom,
    !isBottom && styles.itemSeparator,
  ];

  // Determine icon name to use
  let iconToUse = iconName;
  if (!iconToUse && symbol) {
    // Try to map the symbol to an Ionicons name
    iconToUse = symbolToIconMap[symbol] || "document-outline"; // Default icon
  }

  const content = (
    <>
      <Text style={styles.title}>{title}</Text>
      {(symbol || iconToUse) && (
        <View style={styles.iconContainer}>
          <Ionicons
            name={(iconToUse as any) || "document-outline"}
            size={17}
            color="rgba(235, 235, 245, 0.6)"
          />
        </View>
      )}
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
  // Convert text symbols to icon names if needed
  const mappedItems = items.map((item) => {
    if (item.symbol && !item.iconName) {
      const iconName = symbolToIconMap[item.symbol] || undefined;
      return { ...item, iconName };
    }
    return item;
  });

  return (
    <View style={styles.listContainer}>
      {mappedItems.map((item, index) => (
        <ListItem
          key={item.id}
          {...item}
          isTop={index === 0}
          isBottom={index === mappedItems.length - 1}
        />
      ))}
    </View>
  );
};

export default List;
