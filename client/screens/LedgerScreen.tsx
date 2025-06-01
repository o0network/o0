import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Linking,
  Text as RNText,
  Platform,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import type { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import type { TabParamList } from "../App";

import {
  Switch,
  Frame,
  Outbound,
  Field,
  Text,
  Button,
  SafeAreaView,
  Inbound,
  CandlestickMiniGraph,
  WagmiMainGraph,
  Link
} from "../components";
import { AssetData, PriceData } from "../data/api";
import { ApiService } from "../data/api";
import { openLink } from "@telegram-apps/sdk";
import { usePlatform } from "../contexts/ScreenContext";

const getHeatColor = (value: number, min: number, max: number) => {
  if (max === min) return 'rgb(0,200,0)';
  const norm = (value - min) / (max - min);
  const r = Math.round(255 * (1 - norm));
  const g = Math.round(200 * norm + 55 * (1 - norm));
  return `rgb(${r},${g},60)`;
};

const createAssetGridData = (
  assets: AssetData[],
  priceChanges = true
): { grid: string[][], labels: { value: string; symbol: string; address: string; }[][] } => {
  if (!assets || assets.length === 0) {
    return {
      grid: [["#C5E021", "#B2DD2D", "#2DB27D"]],
      labels: [[{ value: "0", symbol: "", address: "" }]]
    };
  }

  let sortedAssets = [...assets];
  sortedAssets.sort((a, b) => {
    const valueA = parseFloat(String(a.value || 0).replace(/[^0-9.-]+/g, "")) || 0;
    const valueB = parseFloat(String(b.value || 0).replace(/[^0-9.-]+/g, "")) || 0;
    return valueB - valueA;
  });

  const assetGroups: { [key: string]: AssetData[] } = {};
  sortedAssets.forEach(asset => {
    const type = asset.type || 'other';
    if (!assetGroups[type]) {
      assetGroups[type] = [];
    }
    assetGroups[type].push(asset);
  });

  // Calculate min/max for heat map
  const values = sortedAssets.map(a => {
    const parsedValue = parseFloat(String(a.value || 0).replace(/[^0-9.-]+/g, ""));
    return isNaN(parsedValue) ? 0 : parsedValue;
  });
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const gridData: string[][] = [];
  const labelsData: { value: string; symbol: string; address: string; }[][] = [];

  const rows = Math.ceil(Math.sqrt(sortedAssets.length));
  const cols = Math.ceil(sortedAssets.length / rows);

  for (let i = 0; i < rows; i++) {
    gridData[i] = new Array(cols).fill('#333333');
    labelsData[i] = new Array(cols).fill({ value: "", symbol: "", address: "" });
  }

  let row = 0, col = 0;
  sortedAssets.forEach(asset => {
    const value = parseFloat(String(asset.value || 0).replace(/[^0-9.-]+/g, "")) || 0;
    const color = getHeatColor(value, minValue, maxValue);
    gridData[row][col] = color;
    labelsData[row][col] = {
      value: (asset.value != null ? asset.value.toString() : "0"),
      symbol: asset.symbol || "",
      address: asset.address || "",
    };
    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
  });

  return { grid: gridData, labels: labelsData };
};

type ViewMode = "map" | "list";

type AssetsScreenProps = {
  initialAddress?: string;
};

type RouteParams = {
  address?: string;
};

type Stats = {
  price: string;
  minted: string;
  value: string;
};

// CellGrid component moved inline
type CellGridProps = {
  data: string[][];
  style?: StyleProp<ViewStyle>;
  onSelect?: (rowIndex: number, colIndex: number) => void;
  selectedCoords?: { row: number; col: number } | null;
  assetLabels?: {
    value: string;
    symbol: string;
    address: string;
  }[][];
};

const CellGrid = ({
  data,
  style,
  onSelect,
  selectedCoords,
  assetLabels,
}: CellGridProps) => {
  return (
    <View style={[cellGridStyles.container, style]}>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={cellGridStyles.rowContainer}>
          {row.map((color, colIndex) => {
            const isSelected =
              selectedCoords?.row === rowIndex &&
              selectedCoords?.col === colIndex;
            const cellId = `${rowIndex}-${colIndex}`;
            const label = assetLabels?.[rowIndex]?.[colIndex];

            return (
              <TouchableOpacity
                key={cellId}
                style={[
                  cellGridStyles.cellOuter,
                  label && label.value ? {
                    flex: Math.max(1, Math.min(3, parseFloat(label.value) / 200)),
                  } : {}
                ]}
                onPress={onSelect ? () => onSelect(rowIndex, colIndex) : undefined}
                activeOpacity={0.8}
              >
                <View style={[cellGridStyles.cellInner, { backgroundColor: color }]}>
                  {label && label.symbol && (
                    <View style={cellGridStyles.labelContainer}>
                      <RNText style={cellGridStyles.symbolText} numberOfLines={1}>
                        {label.symbol}
                      </RNText>
                      {label.value && parseFloat(label.value) > 0 && (
                        <RNText style={cellGridStyles.valueText} numberOfLines={1}>
                          ${parseFloat(label.value).toFixed(0)}
                        </RNText>
                      )}
                    </View>
                  )}
                </View>
                {isSelected && <View style={cellGridStyles.selectedCellBorder} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const cellGridStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 12,
    backgroundColor: "transparent",
    width: "100%",
    gap: 4,
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  cellOuter: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  cellInner: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCellBorder: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  labelContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  symbolText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  valueText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export const LedgerScreen = ({ initialAddress }: AssetsScreenProps) => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const routeAddress = route.params?.address;

  // Use routeAddress (from URL) as priority, fall back to initialAddress prop
  const addressFromUrl = routeAddress || initialAddress;

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMapCell, setSelectedMapCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [displayData, setDisplayData] = useState<AssetData[]>([]);
  const [gridData, setGridData] = useState<string[][]>([]);
  const [gridLabels, setGridLabels] = useState<{ value: string; symbol: string; address: string; }[][]>([]);
  const [address, setAddress] = useState<string | undefined>(addressFromUrl);
  const [currentPriceData, setCurrentPriceData] = useState<PriceData>({
    timeframe: "1Y",
    points: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Stats>({
    price: "0",
    minted: "0",
    value: "0"
  });
  const [selectedItem, setSelectedItem] = useState<AssetData | null>(null);

  const platformContext = usePlatform();
  const navigation = useNavigation<MaterialTopTabNavigationProp<TabParamList>>();

  useEffect(() => {
    const currentAddress = addressFromUrl || '';
    setAddress(currentAddress);
    setIsLoading(true);
    (async () => {
      try {
        const userKey = currentAddress || 'default-user';
        const fetchedAssets = await ApiService.getAssetsByAddress(userKey);
        setAssets(fetchedAssets);
        setDisplayData(fetchedAssets);

        // Create grid data for heat map
        const { grid, labels } = createAssetGridData(fetchedAssets);
        setGridData(grid);
        setGridLabels(labels);

        // If we have an address from URL, try to select that specific asset
        if (addressFromUrl) {
          const assetToSelect = fetchedAssets.find(asset => asset.address === addressFromUrl);
          if (assetToSelect) {
            setSelectedItem(assetToSelect);
          } else {
            // If asset not found in user's ledger, try to load it individually
            try {
              const assetInfo = await ApiService.getAssetInfo(addressFromUrl);
              if (assetInfo) {
                const updatedAssets = [...fetchedAssets, assetInfo];
                setAssets(updatedAssets);
                setDisplayData(updatedAssets);
                setSelectedItem(assetInfo);
              }
            } catch (error) {
              console.error("Error loading specific asset:", error);
            }
          }
        } else {
          // Automatically select the first item if no specific address requested
          if (fetchedAssets.length > 0) {
            const firstItem = fetchedAssets[0];
            setSelectedItem(firstItem);
          }
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [addressFromUrl]);

  // Update grid data when search filters change displayData
  useEffect(() => {
    if (assets.length > 0) {
      const { grid, labels } = createAssetGridData(displayData);
      setGridData(grid);
      setGridLabels(labels);
    }
  }, [displayData]);

  // Handle search filtering and update grid data
  useEffect(() => {
    const filteredData = assets.filter((item) => {
      const searchTextLower = searchText.toLowerCase();
      const asset = item as AssetData;
      return asset.address?.toLowerCase().includes(searchTextLower) ||
             asset.symbol?.toLowerCase().includes(searchTextLower);
    });

    setDisplayData(filteredData);
  }, [searchText, assets]);

  // Effect for fetching price data (currentPriceData state)
  useEffect(() => {
    const fetchPriceDataLogic = async () => {
      if (!selectedItem?.address) {
        setCurrentPriceData({ timeframe: "N/A", points: [] });
        return;
      }

      setIsLoading(true);
      try {
        const priceData = await ApiService.getPriceData(selectedItem.address);
        setCurrentPriceData(priceData);
      } catch (error) {
        console.error("Error fetching price data:", error);
        setCurrentPriceData({ timeframe: "Error", points: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceDataLogic();
  }, [selectedItem?.address]); // Only fetch when selected item changes

  // Effect for updating stats (stats state)
  useEffect(() => {
    const updateStatsLogic = async () => {
      try {
        if (selectedItem) {
          const asset = selectedItem as AssetData;
          setStats({
            price: asset.stat?.price?.toFixed(2) || "N/A",
            minted: asset.stat?.minted?.toString() || "N/A",
            value: asset.stat?.value?.toFixed(2) || "N/A",
          });
        } else {
          setStats({ price: "N/A", minted: "N/A", value: "N/A" });

          // Clear URL when no asset is selected
          if (Platform.OS === 'web') {
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/ledger/') && currentPath !== '/ledger') {
              window.history.replaceState({}, "", '/ledger');
            }
          }
        }
      } catch (error) {
        console.error("Error updating stats:", error);
        setStats({ price: "Error", minted: "Error", value: "Error" });
      }
    };

    updateStatsLogic();
  }, [selectedItem]);

  const handleAssetOrPitchSelect = (item: AssetData) => {
    setSelectedItem(item);

    // Update URL to reflect selected asset
    if (Platform.OS === 'web' && item.address) {
      const targetPath = `/ledger/${encodeURIComponent(item.address)}`;
      window.history.replaceState({}, "", targetPath);
    }
  };

  const handleBuyPress = () => {
    if (!selectedItem) {
      Alert.alert("No Asset Selected", "Please select an asset to buy.");
      return;
    }

    // For now, show an alert. This could be replaced with a proper trading modal
    Alert.alert(
      "Buy Asset",
      `Would you like to buy ${selectedItem.symbol || selectedItem.address}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy", onPress: () => {
          console.log("Buy action for:", selectedItem.address);
          // TODO: Implement actual buy functionality
        }}
      ]
    );
  };

  const handleSellPress = () => {
    if (!selectedItem) {
      Alert.alert("No Asset Selected", "Please select an asset to sell.");
      return;
    }

    // For now, show an alert. This could be replaced with a proper trading modal
    Alert.alert(
      "Sell Asset",
      `Would you like to sell ${selectedItem.symbol || selectedItem.address}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sell", onPress: () => {
          console.log("Sell action for:", selectedItem.address);
          // TODO: Implement actual sell functionality
        }}
      ]
    );
  };

  const handlePitchPress = () => {
    if (!selectedItem || !selectedItem.address) {
      Alert.alert("No Asset Selected", "Please select an asset to view its pitch.");
      return;
    }

    // Navigate to explore screen with the asset address
    if (Platform.OS === 'web') {
      // const targetPath = `/explore/${encodeURIComponent(selectedItem.address)}`;
      // window.location.href = targetPath;
      navigation.navigate("Explore", { address: selectedItem.address });
    } else {
      // For mobile, you might need to use a different navigation method
      console.log("Navigate to explore screen with address:", selectedItem.address);
      navigation.navigate("Explore", { address: selectedItem.address });
    }
  };

  const renderListItem = ({ item }: { item: AssetData }) => {
    const isSelected = selectedItem?.address === item.address;
    const asset = item;

    const itemName = asset.address; // Use address as name
    const itemValueDisplay = asset.stat?.value?.toFixed(2) || "N/A";

    // Calculate price change from price array
    let itemPriceChange = 0;
    if (asset.price && asset.price.length >= 2) {
      const firstPrice = asset.price[0];
      const lastPrice = asset.price[asset.price.length - 1];
      if (firstPrice > 0) {
        itemPriceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
      }
    }

    const itemMintedDisplay = asset.stat?.minted?.toString() || "N/A";
    const itemAddressDisplay = item.address || "No Address";

    return (
      <TouchableOpacity
        onPress={() => handleAssetOrPitchSelect(item)}
        style={styles.touchableListItem}
      >
        <Frame style={[styles.listItemFrame, isSelected && styles.selectedListItemFrame]}>
          <View style={styles.listItemContainer}>
            {/* Left Section (80%) */}
            <View style={styles.listItemLeftSection}>
              <View style={styles.listItemStatsLine1}>
                <RNText style={[styles.listItemPriceChange, { color: itemPriceChange >= 0 ? "#4CAF50" : "#F44336" }]}>
                  {itemPriceChange >= 0 ? "+" : ""}{itemPriceChange.toFixed(2)}%
                </RNText>
                <RNText style={styles.listItemValue}>${itemValueDisplay}</RNText>
                <RNText style={styles.listItemMinted}>{itemMintedDisplay}</RNText>
              </View>
              <RNText style={styles.listItemAddress} numberOfLines={1} ellipsizeMode="middle">
                {itemName !== itemAddressDisplay ? `${itemName} (${itemAddressDisplay})` : itemAddressDisplay}
              </RNText>
            </View>

            {/* Right Section */}
            <View style={styles.listItemRightSection}>
              <CandlestickMiniGraph style={styles.listItemMiniGraph} prices={asset.price || []} />
            </View>
          </View>
        </Frame>
      </TouchableOpacity>
    );
  };

  const AssetsContent = () => {
    if (displayData.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items found</Text>
        </View>
      );
    }

    return (
      <>
        {viewMode === "list" ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {displayData.map((item, index) => (
              <View key={`asset-${index}`} style={styles.listItemWrapper}>
                {renderListItem({ item })}
              </View>
            ))}
          </ScrollView>
      ) : (
          <CellGrid
            data={gridData}
            selectedCoords={selectedMapCell}
            onSelect={(row, col) => {
              setSelectedMapCell({ row, col });
              const index = row * (gridData[0]?.length || 0) + col;
              if (index < displayData.length) {
                handleAssetOrPitchSelect(displayData[index]);
              }
            }}
            assetLabels={gridLabels}
          />
        )}
      </>
    );
  };

  const GraphView = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    return (
      <Frame style={[styles.graphContainer, style]}>
        <WagmiMainGraph data={currentPriceData?.points || []} />
      </Frame>
    );
  };

  // Handle initial address focus
  useEffect(() => {
    if (initialAddress && assets.length > 0 && !selectedItem) {
      const itemToSelect = assets.find(item => item.address === initialAddress);
      if (itemToSelect) {
        handleAssetOrPitchSelect(itemToSelect);
      }
    }
  }, [initialAddress, assets, selectedItem]);

  // Handle direct URL navigation - load specific asset info
  useEffect(() => {
    if (initialAddress && assets.length > 0) {
      const loadSpecificAsset = async () => {
        // Check if the asset is already in the list
        const existingAsset = assets.find(item => item.address === initialAddress);
        if (existingAsset) {
          handleAssetOrPitchSelect(existingAsset);
          return;
        }

        // Load the specific asset info from API
        try {
          const assetInfo = await ApiService.getAssetInfo(initialAddress);
          if (assetInfo) {
            // Add the asset to the list and select it
            setAssets(prevAssets => {
              const updatedAssets = [...prevAssets, assetInfo];
              setDisplayData(updatedAssets);
              return updatedAssets;
            });

            // Select the newly loaded asset
            setTimeout(() => {
              handleAssetOrPitchSelect(assetInfo);
            }, 100);
          }
        } catch (error) {
          console.error("Error loading specific asset:", error);
        }
      };

      loadSpecificAsset();
    }
  }, [initialAddress, assets, handleAssetOrPitchSelect]);

  if (isLoading && !address && !assets.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <Outbound style={styles.headerOutbound}>

        <Frame style={styles.statsSection}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Current Price</Text>
            <Text style={styles.statsValue}>${stats.price}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Minted</Text>
            <Text style={styles.statsValue}>{stats.minted}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Value</Text>
            <Text style={styles.statsValue}>${stats.value}</Text>
          </View>
        </Frame>

        <View style={styles.portfolioContainer}>
          <GraphView style={styles.mainGraph} />
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Buy"
            style={styles.actionButton}
            iconPath={require("../assets/emojis/money-face.png")}
            onPress={handleBuyPress}
            textStyle={styles.actionButtonText}
          />

          <Link href={selectedItem?.discussion || ""} external={true}>
            <Button
              title="Group"
              style={styles.actionButton}
              iconPath={require("../assets/emojis/talk.png")}
              textStyle={styles.actionButtonText}
            />
          </Link>

          <Button
            title="Pitch"
            style={styles.actionButton}
            iconPath={require("../assets/emojis/camera.png")}
            textStyle={styles.actionButtonText}
          />

          <Button
            title="Sell"
            style={styles.actionButton}
            iconPath={require("../assets/emojis/money-wings.png")}
            onPress={handleSellPress}
            textStyle={styles.actionButtonText}
          />
        </View>
      </Outbound>

      <Outbound style={styles.searchSwitchOutbound}>
        <View style={{ position: "relative", width: "100%" }}>
          <Field
            placeholder="Search Assets or Pitches"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          <Switch style={{ position: "absolute", right: 0 }}>
            <Switch.Tab
              label="Map"
              img={require("../assets/emojis/map.png")}
              active={viewMode === "map"}
              onPress={() => setViewMode("map")}
            />
            <Switch.Tab
              label="List"
              img={require("../assets/emojis/list.png")}
              active={viewMode === "list"}
              onPress={() => setViewMode("list")}
            />
          </Switch>
        </View>

        <View style={styles.assetsContentContainer}>
          <Inbound style={styles.listContainer}>
            {isLoading && (assets.length > 0) ? (
              <Text style={styles.loadingText}>Updating...</Text>
            ) : (
              <AssetsContent />
            )}
          </Inbound>
        </View>
      </Outbound>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingVertical: 8,
    width: '100%',
  },
  headerOutbound: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  portfolioContainer: {
    flexDirection: "column",
    width: '100%',
  },
  mainGraph: {
    width: "100%",
    minHeight: 300,
    padding: 8,
  },
  statsSection: {
    flexDirection: "row",
    paddingVertical: 8,
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 15,
    width: '100%',
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
    gap: 4
  },
  statsLabel: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    marginBottom: 2,
  },
  statsValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  pitchBarPlaceholder: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 12,
  },
  pitchBarText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    width: '100%',
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 25,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  graphContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4CAF50",
  },
  graphTimeframe: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  graphContent: {
    flexDirection: "row",
    height: 180,
    width: '100%',
  },
  graphYAxis: {
    width: 60,
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  axisLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  graphCanvas: {
    flex: 1,
    height: "100%",
    position: "relative",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    textAlign: "center",
  },
  searchSwitchOutbound: {
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 25,
    padding: 16,
    flex: 1,
    width: 'auto',
  },
  searchInput: {
    width: "100%",
    height: 40,
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",
    fontFamily: "Nunito_600SemiBold",
    borderRadius: 999,
  },
  assetsContentContainer: {
    marginTop: 10,
    flex: 1,
    width: '100%',
    alignSelf: 'stretch',
    paddingBottom: 10,
  },
  listItemWrapper: {
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  touchableListItem: {
    width: '100%',
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 8,
    width: '100%',
    height: '100%',
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-evenly",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  barColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  dataBar: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 999,
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "100%",
  },
  outerBar: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 999,
    width: 4,
  },
  innerBar: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 999,
    position: "absolute",
  },
  miniGraphLoadingContainer: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
  },
  miniGraphInfoText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
  },
  listItemFrame: {
    flexDirection: "row",
    width: '100%',
    alignItems: "center",
    alignSelf: 'stretch',
    borderRadius: 12,
  },
  selectedListItemFrame: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  listItemContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 16
  },
  listItemLeftSection: {
    flex: 0.7,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingLeft: 8,
  },
  listItemRightSection: {
    flex: 0.3,
    minWidth: 120,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  listItemMiniGraph: {
    width: 120,
    height: 80,
  },
  listItemStatsLine1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listItemPriceChange: {
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  listItemValue: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginHorizontal: 6,
    flexShrink: 1,
  },
  listItemMinted: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    flexShrink: 1,
  },
  listItemAddress: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: "DMMono_500Medium",
  },
  mapViewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    height: '100%',
    width: '100%',
    alignSelf: 'stretch',
  },
  cellGridStyle: {
    width: '100%',
    height: '100%',
    padding: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 100,
  },
  emptyStateText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  graphTopLabel: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  graphBottomLabel: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  graphCanvasLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default LedgerScreen;
