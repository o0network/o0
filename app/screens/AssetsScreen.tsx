import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Switch,
  CellGrid,
  Frame,
  Inbound,
  Outbound,
  Field,
  Text,
  Button,
} from "../components";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssetData, PriceData } from "../data/api";
import { ApiService } from "../data/api";

const mockListData = [
  { id: "1", title: "Asset 1 - 0xabc...def", symbol: "🪙" },
  { id: "2", title: "Asset 2 - sth.eth", symbol: "🪙" },
  { id: "3", title: "Asset 3 - another.eth", symbol: "🪙" },
];

const DEFAULT_ADDRESS = "o0.network";

const createAssetGridData = (assets: AssetData[]): string[][] => {
  if (!assets || assets.length === 0)
    return [["#C5E021", "#B2DD2D", "#2DB27D"]];

  const colors = assets.map((asset) => asset.color || "#CDDC39");

  const rows = Math.ceil(Math.sqrt(colors.length));
  const cols = Math.ceil(colors.length / rows);

  const grid: string[][] = [];
  let colorIndex = 0;

  for (let i = 0; i < rows; i++) {
    const row: string[] = [];
    for (let j = 0; j < cols; j++) {
      if (colorIndex < colors.length) {
        row.push(colors[colorIndex]);
        colorIndex++;
      } else {
        row.push("#333333");
      }
    }
    grid.push(row);
  }

  return grid;
};

type ViewMode = "map" | "list";

type AssetsScreenProps = {
  initialAddress?: string;
};

export const AssetsScreen = ({ initialAddress }: AssetsScreenProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMapCell, setSelectedMapCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [gridData, setGridData] = useState<string[][]>([]);
  const [address, setAddress] = useState<string>(DEFAULT_ADDRESS);
  const [totalValue, setTotalValue] = useState<string>("0");
  const [performance, setPerformance] = useState<number>(0);
  const [priceData, setPriceData] = useState<PriceData>({
    timeframe: "1Y",
    points: [],
  });

  useEffect(() => {
    // Get address from props or use default
    const currentAddress = initialAddress || DEFAULT_ADDRESS;
    setAddress(currentAddress);

    // Load assets and other data for this address
    const addressAssets = ApiService.getAssetsByAddress(currentAddress);
    setAssets(addressAssets);

    // Create grid data for the map view
    setGridData(createAssetGridData(addressAssets));

    // Get total portfolio value
    setTotalValue(ApiService.getTotalPortfolioValue(currentAddress));

    // Get portfolio performance
    setPerformance(ApiService.getPortfolioPerformance(currentAddress));

    // Get price data for chart
    setPriceData(ApiService.getPriceData(currentAddress));
  }, [initialAddress]);

  const AssetsContent = () => {
    if (assets.length === 0)
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No assets found</Text>
        </View>
      );

    if (viewMode === "list") {
      const filteredAssets = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchText.toLowerCase()) ||
          asset.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
          asset.address.toLowerCase().includes(searchText.toLowerCase())
      );

      return (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredAssets.map((asset) => (
            <View key={asset.id} style={styles.assetCard}>
              <Text style={styles.assetSymbol}>{asset.symbol}</Text>
              <View style={styles.assetDetails}>
                <Text style={styles.assetTitle}>{asset.name}</Text>
                <Text style={styles.assetId}>{asset.shortAddress}</Text>
              </View>
              <View style={styles.assetValue}>
                <Text style={styles.valueText}>{asset.value}</Text>
                <View style={styles.changeContainer}>
                  <Text
                    style={[
                      styles.changeText,
                      { color: asset.priceChange >= 0 ? "#4CAF50" : "#F44336" },
                    ]}
                  >
                    {asset.priceChange >= 0 ? "+" : ""}
                    {asset.priceChange.toFixed(1)}%
                  </Text>
                  <Text style={styles.updateTime}>{asset.lastUpdated}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <CellGrid
          data={gridData}
          selectedCoords={selectedMapCell}
          onSelect={(row, col) => {
            setSelectedMapCell({ row, col });
            // Find corresponding asset if possible
            const index = row * gridData[0].length + col;
            if (index < assets.length) {
              console.log(`Selected asset: ${assets[index].name}`);
            }
          }}
        />
      );
    }
  };

  const GraphView = () => {
    const { width } = Dimensions.get("window");
    const chartWidth = width * 0.8;
    const chartHeight = 110;

    if (!priceData.points.length) {
      return (
        <View style={styles.graphPlaceholder}>
          <Text style={styles.priceLabel}>No price data available</Text>
        </View>
      );
    }

    const yValues = priceData.points.map((point: any) => point[1]);
    const maxValue = Math.max(...yValues);
    const minValue = Math.min(...yValues);
    const range = maxValue - minValue;

    return (
      <View>
        <View style={styles.chartHeader}>
          <Text style={styles.chartLabel}>Portfolio Performance</Text>
          <Text
            style={[
              styles.performanceText,
              { color: performance >= 0 ? "#4CAF50" : "#F44336" },
            ]}
          >
            {performance >= 0 ? "+" : ""}
            {performance.toFixed(1)}%
          </Text>
        </View>
        <View style={styles.graphPlaceholder}>
          <View style={styles.chartContainer}>
            {priceData.points.map((point: any, index: number) => {
              const height =
                ((point[1] - minValue) / range) * (chartHeight * 0.8);
              return (
                <View
                  key={index}
                  style={[
                    styles.chartBar,
                    {
                      height: Math.max(4, height),
                      backgroundColor:
                        performance >= 0
                          ? "rgba(76, 175, 80, 0.7)"
                          : "rgba(244, 67, 54, 0.7)",
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.priceLabel}>Price ({priceData.timeframe})</Text>
        </View>
      </View>
    );
  };

  if (assets.length === 0 && address !== DEFAULT_ADDRESS) {
    return (
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text>Loading assets for {address}...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Outbound style={styles.frameContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.addressBox}>
              <Text style={styles.addressText}>{address}</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={styles.totalValueLabel}>Total Value</Text>
              <Text style={styles.totalValue}>${totalValue}</Text>
            </View>
          </View>
          <View style={styles.actionsContainer}>
            <Button title="Buy" style={styles.actionButton} />
            <Button title="Sell" style={styles.actionButton} />
            <Button title="DAO" style={styles.actionButton} />
          </View>
          <View style={styles.dynamicContentContainer}>
            <GraphView />
          </View>
        </Outbound>
        <Outbound>
          <Field
            placeholder="Search Assets"
            placeholderTextColor="rgba(255, 255, 255, 0.23)"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          >
            <Switch>
              <Switch.Tab
                tab={{
                  key: "map",
                  label: "Map",
                  emoji: "🗺️",
                }}
                active={viewMode === "map"}
                onPress={() => setViewMode("map")}
              />
              <Switch.Tab
                tab={{
                  key: "list",
                  label: "List",
                  emoji: "📄",
                }}
                active={viewMode === "list"}
                onPress={() => setViewMode("list")}
              />
            </Switch>
          </Field>
          <AssetsContent />
          <Button
            title="Load Next Video"
            onPress={() => {}}
            style={styles.nextVideoButton}
          />
        </Outbound>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    marginRight: 8,
  },
  outerContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
  },
  safeArea: {
    flex: 1,
    gap: 8,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  frameContainer: {},
  headerContainer: {
    padding: 12,
    alignItems: "center",
  },
  addressBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: "stretch",
    alignItems: "center",
  },
  addressText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontFamily: "DMMono_500Medium",
  },
  valueContainer: {
    alignItems: "center",
  },
  totalValueLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  totalValue: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  chartLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
  },
  performanceText: {
    fontSize: 15,
    fontWeight: "600",
  },
  graphPlaceholder: {
    height: 110,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 4,
    alignSelf: "stretch",
    padding: 8,
    overflow: "hidden",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    height: "90%",
  },
  chartBar: {
    width: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    margin: 2,
  },
  priceLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 4,
  },
  dynamicContentContainer: {
    flex: 1,
    alignSelf: "stretch",
  },
  listContainer: {
    alignItems: "center",
    gap: 8,
    paddingTop: 10,
    width: "100%",
    paddingBottom: 20,
  },
  assetCard: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  assetSymbol: {
    fontSize: 24,
    marginRight: 12,
  },
  assetDetails: {
    flex: 1,
  },
  assetTitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
    fontWeight: "600",
  },
  assetId: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontFamily: "DMMono_500Medium",
  },
  assetValue: {
    alignItems: "flex-end",
  },
  valueText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 15,
    fontWeight: "600",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  updateTime: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFFFFF",
  },
  nextVideoButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  noVideosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noVideosTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  noVideosSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 40,
  },
  createBubbleFrame: {
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
  },
  createBubbleTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 12,
  },
  createBubbleText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  createBubbleButton: {
    width: "100%",
    paddingVertical: 14,
  },
});

export default AssetsScreen;
