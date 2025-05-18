import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Linking,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

import {
  Switch,
  CellGrid,
  Frame,
  Outbound,
  Field,
  Text,
  Button,
  SafeAreaView,
} from "../components";
import { AssetData, PriceData, VideoData } from "../data/api";
import { ApiService } from "../data/api";
import { openLink } from "@telegram-apps/sdk";
import { usePlatform } from "../contexts/ScreenContext";

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

  // Sort assets by value for better visualization
  let sortedAssets = [...assets];

  // Convert string values to numbers for sorting by value
  sortedAssets.sort((a, b) => {
    const valueA = parseFloat(String(a.value).replace(/[^0-9.-]+/g, ""));
    const valueB = parseFloat(String(b.value).replace(/[^0-9.-]+/g, ""));
    return valueB - valueA; // Descending order
  });

  // Group assets into categories based on type
  const assetGroups: { [key: string]: AssetData[] } = {};
  sortedAssets.forEach(asset => {
    const type = asset.type || 'other';
    if (!assetGroups[type]) {
      assetGroups[type] = [];
    }
    assetGroups[type].push(asset);
  });

  // Create a grid where cell size correlates to asset value
  const gridData: string[][] = [];
  const labelsData: { value: string; symbol: string; address: string; }[][] = [];

  const groupColors: { [key: string]: string } = {
    token: '#4CAF50',    // Green for tokens
    nft: '#2196F3',      // Blue for NFTs
    pitch: '#FFC107',    // Yellow for pitches
    other: '#9C27B0'     // Purple for other types
  };

  // Calculate total value for size distribution
  const totalValue = sortedAssets.reduce((sum, asset) => {
    const value = parseFloat(String(asset.value).replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(value) ? 0 : value);
  }, 0);

  // Create a grid that roughly represents the distribution of values
  // We'll use a simple algorithm to assign cells based on relative value
  const rows = Math.ceil(Math.sqrt(sortedAssets.length));
  const cols = Math.ceil(sortedAssets.length / rows);

  // Initialize grid with empty strings and empty labels
  for (let i = 0; i < rows; i++) {
    gridData[i] = new Array(cols).fill('#333333');
    labelsData[i] = new Array(cols).fill({ value: "", symbol: "", address: "" });
  }

  // Fill the grid with asset colors and labels
  let row = 0, col = 0;
  sortedAssets.forEach(asset => {
    const value = parseFloat(String(asset.value).replace(/[^0-9.-]+/g, ""));
    const relativeValue = isNaN(value) ? 0 : (value / totalValue);

    // Determine color based on price change or predefined color
    let color;
    if (priceChanges) {
      // Price change color gradient (red to green)
      const changeIntensity = Math.min(Math.abs(asset.priceChange) / 10, 1);
      if (asset.priceChange >= 0) {
        // Green gradient for positive change
        const g = Math.floor(100 + changeIntensity * 155);
        color = `rgb(0, ${g}, 0)`;
      } else {
        // Red gradient for negative change
        const r = Math.floor(100 + changeIntensity * 155);
        color = `rgb(${r}, 0, 0)`;
      }
    } else {
      // Use type-based color
      color = groupColors[asset.type] || groupColors.other;
    }

    // Assign color to the corresponding cell
    gridData[row][col] = color;

    // Assign label data to the corresponding cell
    labelsData[row][col] = {
      value: asset.value.toString(),
      symbol: asset.symbol || "",
      address: asset.address || "",
    };

    // Move to the next position
    col++;
    if (col >= cols) {
      col = 0;
      row++;
    }
  });

  return { grid: gridData, labels: labelsData };
};

const createAssetDisplayData = (
  assets: AssetData[],
  videos: VideoData[]
): (AssetData | (VideoData & { type: string; id: string; stats?: any }))[] => {
  return [
    ...assets,
    ...videos.map((v) => ({
      ...v,
      id: v.address,
      type: "pitch",
      name: v.address,
    })),
  ];
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

export const AssetsScreen = ({ initialAddress }: AssetsScreenProps) => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const routeAddress = route.params?.address;
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedMapCell, setSelectedMapCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [pitches, setPitches] = useState<VideoData[]>([]);
  const [displayData, setDisplayData] = useState<(AssetData | VideoData)[]>([]);
  const [gridData, setGridData] = useState<string[][]>([]);
  const [gridLabels, setGridLabels] = useState<{ value: string; symbol: string; address: string; }[][]>([]);
  const [address, setAddress] = useState<string | undefined>(routeAddress || initialAddress);
  const [totalValue, setTotalValue] = useState<string>("0");
  const [performance, setPerformance] = useState<number>(0);
  const [currentPriceData, setCurrentPriceData] = useState<PriceData>({
    timeframe: "1Y",
    points: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPitchAddress, setSelectedPitchAddress] = useState<string | null>(null);
  const [allInvestments, setAllInvestments] = useState<AssetData[]>([]);
  const [stats, setStats] = useState<Stats>({
    price: "0",
    minted: "0",
    value: "0"
  });
  const [selectedItem, setSelectedItem] = useState<AssetData | VideoData | null>(null);

  const platformContext = usePlatform();

  useEffect(() => {
    // Use provided address or a default address
    const currentAddress = routeAddress || initialAddress || "0xDefaultUserAddress";
    setAddress(currentAddress);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          fetchedAssets,
          fetchedPitches,
          portfolioValue,
          portfolioPerformance,
          portfolioPriceData,
        ] = await Promise.all([
          ApiService.getAssetsByAddress(currentAddress),
          ApiService.fetchVideos(10),
          ApiService.getTotalPortfolioValue(currentAddress),
          ApiService.getPortfolioPerformance(currentAddress),
          ApiService.getPriceData(currentAddress),
        ]);

        setAssets(fetchedAssets);
        setPitches(fetchedPitches);
        setAllInvestments(fetchedAssets);

        const combinedData = createAssetDisplayData(
          fetchedAssets,
          fetchedPitches
        );
        setDisplayData(combinedData);

        const { grid, labels } = createAssetGridData(fetchedAssets, true);
        setGridData(grid);
        setGridLabels(labels);

        setTotalValue(portfolioValue);
        setPerformance(portfolioPerformance);
        setCurrentPriceData(portfolioPriceData);
        setSelectedPitchAddress(null);

        if (fetchedAssets.length > 0 && !selectedItem) {
          const portfolioTotalValue = await ApiService.getTotalPortfolioValue(currentAddress);
          setStats({
            price: currentPriceData.points.length > 0 ? currentPriceData.points[currentPriceData.points.length -1].value.toFixed(2) : "N/A",
            minted: "N/A",
            value: portfolioTotalValue
          });
        }
      } catch (error) {
        console.error("Error loading initial assets data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialAddress, routeAddress]);

  useEffect(() => {
    if (!selectedPitchAddress || selectedPitchAddress === "select an item first") {
      return;
    }

    if (selectedPitchAddress) {
      const fetchPitchPrice = async () => {
        setIsLoading(true);
        try {
          const pitchPriceData = await ApiService.getPitchPriceData(
            selectedPitchAddress
          );
          setCurrentPriceData(pitchPriceData);
          if (selectedItem && selectedItem.address === selectedPitchAddress && selectedItem.type === 'pitch') {
            const videoItem = selectedItem as VideoData;
            setStats({
              price: videoItem.stats?.price || "N/A",
              minted: videoItem.stats?.minted || "N/A",
              value: videoItem.stats?.value || "N/A",
            });
          }
        } catch (error) {
          console.error(
            `Error fetching price data for pitch ${selectedPitchAddress}:`,
            error
          );
          setCurrentPriceData({ timeframe: "Error", points: [] });
        } finally {
          setIsLoading(false);
        }
      };
      fetchPitchPrice();
    } else {
      if (address && address !== "select an item first") {
        ApiService.getPriceData(address)
          .then(setCurrentPriceData)
          .catch((err) => {
            console.error(
              "Error fetching portfolio price data after deselecting pitch:",
              err
            );
            setCurrentPriceData({ timeframe: "1Y", points: [] });
          });
        if (address && !selectedItem) {
          ApiService.getTotalPortfolioValue(address).then(portfolioValue => {
            setStats({
              price: currentPriceData.points.length > 0 ? currentPriceData.points[currentPriceData.points.length -1].value.toFixed(2) : "N/A",
              minted: "Portfolio",
              value: portfolioValue,
            });
          });
        }
      }
    }
  }, [selectedPitchAddress, address, selectedItem, currentPriceData.points]);

  const handleAssetOrPitchSelect = (item: AssetData | VideoData) => {
    setSelectedItem(item);
    if (item.type === "pitch" && item.address) {
      setSelectedPitchAddress(item.address);
      const pitch = item as VideoData;
      setStats({
        price: pitch.stats?.price || "N/A",
        minted: pitch.stats?.minted || "N/A",
        value: pitch.stats?.value || "N/A",
      });
    } else {
      setSelectedPitchAddress(null);
      const asset = item as AssetData;
      setStats({
        price: asset.price || "N/A",
        minted: asset.minted || "N/A",
        value: asset.value || "N/A",
      });
      if (address) {
        ApiService.getPriceData(address).then(setCurrentPriceData);
      }
    }
  };

  const renderListItem = ({ item }: { item: AssetData | VideoData }) => {
    const isPitch = item.type === "pitch";
    const asset = item as AssetData;
    const pitch = item as VideoData;

    const itemName = isPitch ? `Pitch: ${pitch.address}` : asset.name;
    const itemValue = isPitch ? pitch.stats?.value || "N/A" : asset.value;
    const itemPriceChange = isPitch
      ? (Math.random() - 0.5) * 10
      : asset.priceChange;
    const itemLastUpdated = isPitch
      ? new Date(pitch.timestamp! * 1000).toLocaleDateString()
      : asset.lastUpdated;
    const itemAddress = isPitch ? pitch.address : asset.address;

    const formatAddress = (address: string) => {
      if (!address) return "";
      if (address.length > 30) {
        return address.substring(0, 25) + "...";
      }
      return address;
    };

    return (
      <TouchableOpacity
        onPress={() => handleAssetOrPitchSelect(item)}
        style={styles.touchableListItem}
      >
        <Frame style={styles.listItemInbound}>
          <View style={styles.assetDetails}>
            <Text style={styles.assetTitle} numberOfLines={1}>
              {itemName}
            </Text>
            <Text style={styles.assetId}>{formatAddress(itemAddress)}</Text>
          </View>
          <View style={styles.assetValue}>
            <Text style={styles.valueText}>${itemValue}</Text>
            <View style={styles.changeContainer}>
              <Text
                style={[
                  styles.changeText,
                  { color: itemPriceChange >= 0 ? "#4CAF50" : "#F44336" },
                ]}
              >
                {itemPriceChange >= 0 ? "+" : ""}
                {itemPriceChange.toFixed(1)}%
              </Text>
              <Text style={styles.updateTime}>{itemLastUpdated}</Text>
            </View>
          </View>
        </Frame>
      </TouchableOpacity>
    );
  };

  const AssetsContent = () => {
    const filteredData = displayData.filter((item) => {
      const searchTextLower = searchText.toLowerCase();
      if (item.type === "pitch") {
        const pitch = item as VideoData;
        return (
          pitch.address?.toLowerCase().includes(searchTextLower) ||
          (pitch.source || "").toLowerCase().includes(searchTextLower)
        );
      } else {
        const asset = item as AssetData;
        return (
          asset.name.toLowerCase().includes(searchTextLower) ||
          asset.symbol.toLowerCase().includes(searchTextLower) ||
          asset.address.toLowerCase().includes(searchTextLower)
        );
      }
    });

    if (filteredData.length === 0 && !isLoading) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items found</Text>
        </View>
      );
    }

    if (viewMode === "list") {
      return (
        <View style={styles.listContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredData.map((item, index) => (
              <View key={`asset-${index}`} style={styles.listItemWrapper}>
                {renderListItem({ item })}
              </View>
            ))}
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={styles.mapViewContainer}>
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
            style={styles.cellGridStyle}
            assetLabels={gridLabels}
          />
        </View>
      );
    }
  };

  const GraphView = ({ style }: { style?: StyleProp<ViewStyle> }) => {
    const points = currentPriceData?.points || [];
    const maxValue = Math.max(...points.map((p) => p.value), 0);
    const minValue = Math.min(...points.map((p) => p.value), 0);
    const range = maxValue - minValue || 1;

    const screenWidth = Dimensions.get("window").width;
    const graphHeight = 180;

    // Apply exponential function to values - f(x) = a * e^(b*x)
    // Parameters a and b control the shape of the exponential curve
    const applyExponential = (value: number, min: number, max: number): number => {
      // Normalize value between 0 and 1
      const normalizedValue = (value - min) / (max - min);
      // Apply exponential function (a=0.2, b=2 as example parameters)
      const a = 0.2;
      const b = 2;
      return a * Math.exp(b * normalizedValue);
    };

    // Calculate bar positions and heights
    const barWidth = Math.max(3, (screenWidth / points.length) - 2);
    const barGap = 2;
    const bars = points.map((point, index) => {
      // Calculate bar height with exponential function
      const expValue = applyExponential(point.value, minValue, maxValue);
      const heightPercent = expValue / applyExponential(maxValue, minValue, maxValue);
      const barHeight = graphHeight * heightPercent;

      // Position bar
      const x = index * (barWidth + barGap);
      const y = graphHeight - barHeight;

      return {
        x,
        y,
        height: barHeight,
        value: point.value,
      };
    });

    return (
      <Frame style={[styles.graphContainer, style]}>
        {points.length > 0 ? (
          <>
            <View style={styles.graphHeader}>
              <Text style={styles.graphTitle}>
                {performance >= 0 ? "+" : ""}
                {performance.toFixed(2)}%
              </Text>
              <Text style={styles.graphTimeframe}>
                {currentPriceData?.timeframe || "1M"}
              </Text>
            </View>

            <View style={styles.graphContent}>
              <View style={styles.graphYAxis}>
                <Text style={styles.axisLabel}>${maxValue.toFixed(2)}</Text>
                <Text style={styles.axisLabel}>
                  ${((maxValue + minValue) / 2).toFixed(2)}
                </Text>
                <Text style={styles.axisLabel}>${minValue.toFixed(2)}</Text>
              </View>
              <View style={styles.graphCanvas}>
                <View style={styles.barChartContainer}>
                  {bars.map((bar, index) => (
                    <View
                      key={index}
                      style={[
                        styles.barStyle,
                        {
                          height: bar.height,
                          width: barWidth,
                          left: bar.x,
                          bottom: 0,
                          backgroundColor: performance >= 0 ? "#4CAF50" : "#F44336",
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No price data available</Text>
          </View>
        )}
      </Frame>
    );
  };

  if (isLoading && !address && !assets.length && !pitches.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading data...</Text>
      </View>
    );
  }




  return (
    <SafeAreaView style={styles.screenContainer}>
      <Outbound style={styles.headerOutbound}>
        <View style={styles.addressBox}>
          <Text style={styles.addressText}>
            {address && address !== "select an item first"
              ? address
              : "Select an item to view assets"}
          </Text>
        </View>

        <View style={styles.portfolioContainer}>
          <GraphView style={styles.leftSection} />
          <Frame style={styles.rightSection}>
            <View style={styles.rightSectionItem}>
              <Text style={styles.totalValueLabel}>Current Price</Text>
              <Text style={styles.totalValue}>${stats.price}</Text>
            </View>
            <View style={styles.rightSectionItem}>
              <Text style={styles.totalValueLabel}>Minted</Text>
              <Text style={styles.totalValue}>${stats.minted}</Text>
            </View>
            <View style={styles.rightSectionItem}>
              <Text style={styles.totalValueLabel}>Value</Text>
              <Text style={styles.totalValue}>${stats.value}</Text>
            </View>
          </Frame>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Buy"
            style={styles.actionButton}
            iconPath={require("../assets/emojis/money-face.png")}
            onPress={() => {
            }}
            textStyle={styles.actionButtonText}
          />

          <Button
            title="Discussion"
            style={styles.actionButton}
            iconPath={require("../assets/emojis/talk.png")}
            onPress={() => {
              if (selectedItem && selectedItem.discussion) {
                platformContext.isPlatform("web") ? openLink(selectedItem.discussion) : Linking.openURL(selectedItem.discussion);
              } else {
                console.warn("No discussion link available for the selected item.");
              }
            }}
            textStyle={styles.actionButtonText}
          />
          <Button
            title="Sell"
            style={styles.actionButton}
            iconPath={require("../assets/emojis/money-wings.png")}
            onPress={() => {
            }}
            textStyle={styles.actionButtonText}
          />
        </View>
      </Outbound>

      <Outbound style={styles.searchSwitchOutbound}>
        <View style={{ position: "relative", flex: 1, width: "100%" }}>
          <Field
            placeholder="Search Assets or Pitches"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          <Switch style={{ position: "absolute", right: 0 }}>
            <Switch.Tab
              tab={{ key: "map", label: "Map", img: require("../assets/emojis/map.png") }}
              active={viewMode === "map"}
              onPress={() => setViewMode("map")}
            />
            <Switch.Tab
              tab={{ key: "list", label: "List", img: require("../assets/emojis/list.png") }}
              active={viewMode === "list"}
              onPress={() => setViewMode("list")}
            />
          </Switch>
        </View>

        <View style={styles.assetsContentContainer}>
          {isLoading && (assets.length > 0 || pitches.length > 0) ? (
            <Text style={styles.loadingText}>Updating...</Text>
          ) : (
            <AssetsContent />
          )}
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
    paddingBottom: 16,
    width: '100%',
  },
  headerOutbound: {
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 20,
  },
  portfolioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  leftSection: {
    flex: 8,
    marginRight: 10,
    justifyContent: "center",
  },
  noDataSection: {
    borderRadius: 15,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  rightSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    marginLeft: 10,
  },
  rightSectionItem: {

    flex: 1,
    gap: 4
  },
  headerFrame: {
    borderRadius: 16,
  },
  headerInbound: {
    padding: 12,
    gap: 8,
  },
  addressBox: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
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
    color: "rgba(255, 255, 255, 0.9)",
    width: '100%',
    fontSize: 14,
    marginBottom: 5,
  },
  totalValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  actionsContainer: {
    flexDirection: "row",
    width: '100%',
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 25,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  graphOutbound: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  graphContainer: {
    height: 240,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  graphInner: {
    padding: 16,
    backgroundColor: "rgba(30, 30, 30, 0.5)",
  },
  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  graphLine: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  lineChart: {
    position: "relative",
    width: "100%",
    borderWidth: 1,
  },
  dataPoint: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 2,
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
    padding: 10,
    width: 'auto',
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
    width: "100%",
    height: 40,
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "left",
    fontFamily: "Nunito_600SemiBold",
  },
  mapListSwitch: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    overflow: "hidden",
  },
  switchButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeSwitch: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  switchText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  assetsContentContainer: {
    marginTop: 10,
    minHeight: 200,
    width: '100%',
    alignSelf: 'stretch',
    paddingBottom: 10,
  },
  listItemInbound: {
    flexDirection: "row",
    width: '100%',
    alignItems: "center",
    padding: 10,
    alignSelf: 'stretch',
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
    fontSize: 22,
    marginRight: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  assetDetails: {
    flex: 1,
    marginRight: 8,
  },
  assetTitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 15,
    fontWeight: "600",
  },
  assetId: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    fontFamily: "DMMono_500Medium",
  },
  assetValue: {
    alignItems: "flex-end",
  },
  valueText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "600",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  updateTime: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 10,
  },
  mapViewContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 200,
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
  nextVideoButton: {
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  centeredMessageText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  searchSwitch: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    width: '100%',
  },
  listItemTouchable: {
    width: '100%',
    marginBottom: 10,
  },
  barChartContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
    height: "100%",
  },
  barStyle: {
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
});

export default AssetsScreen;
