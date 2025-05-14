import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
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
  SafeAreaView,
} from "../components";
import { AssetData, PriceData, VideoData } from "../data/api";
import { ApiService } from "../data/api";
import { usePlatform } from "../contexts/ScreenContext";

const createAssetGridData = (
  assets: AssetData[],
  priceChanges = true
): string[][] => {
  if (!assets || assets.length === 0) {
    return [["#C5E021", "#B2DD2D", "#2DB27D"]];
  }

  // Sort by price change if requested
  let sortedAssets = [...assets];
  if (priceChanges) {
    sortedAssets.sort(
      (a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange)
    );
  }

  const colors = sortedAssets.map((asset) => {
    // Use color based on price change - green for positive, red for negative
    if (priceChanges) {
      return asset.priceChange >= 0 ? "#4CAF50" : "#F44336";
    }
    return asset.color || "#CDDC39";
  });

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

export const AssetsScreen = ({ initialAddress }: AssetsScreenProps) => {
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
  const [address, setAddress] = useState<string | undefined>(initialAddress);
  const [totalValue, setTotalValue] = useState<string>("0");
  const [performance, setPerformance] = useState<number>(0);
  const [currentPriceData, setCurrentPriceData] = useState<PriceData>({
    timeframe: "1Y",
    points: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPitchAddress, setSelectedPitchAddress] = useState<
    string | null
  >(null);
  const [allInvestments, setAllInvestments] = useState<AssetData[]>([]);

  useEffect(() => {
    const currentAddress = initialAddress || "o0.network";
    setAddress(currentAddress);

    if (!currentAddress) {
      setIsLoading(false);
      console.log("AssetsScreen: No initial address provided.");
      setDisplayData([]);
      setCurrentPriceData({ timeframe: "N/A", points: [] });
      setTotalValue("0");
      setPerformance(0);
      return;
    }

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

        // Generate grid data based on price changes
        const gridDataByPriceChange = createAssetGridData(fetchedAssets, true);
        setGridData(gridDataByPriceChange);

        setTotalValue(portfolioValue);
        setPerformance(portfolioPerformance);
        setCurrentPriceData(portfolioPriceData);
        setSelectedPitchAddress(null);
      } catch (error) {
        console.error("Error loading initial assets data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialAddress]);

  useEffect(() => {
    if (selectedPitchAddress) {
      const fetchPitchPrice = async () => {
        setIsLoading(true);
        try {
          const pitchPriceData = await ApiService.getPitchPriceData(
            selectedPitchAddress
          );
          setCurrentPriceData(pitchPriceData);
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
      if (address) {
        ApiService.getPriceData(address)
          .then(setCurrentPriceData)
          .catch((err) => {
            console.error(
              "Error fetching portfolio price data after deselecting pitch:",
              err
            );
            setCurrentPriceData({ timeframe: "1Y", points: [] });
          });
      }
    }
  }, [selectedPitchAddress, address]);

  const handleAssetOrPitchSelect = (item: AssetData | VideoData) => {
    if (item.type === "pitch" && item.address) {
      setSelectedPitchAddress(item.address);
    } else {
      setSelectedPitchAddress(null);
      if (address) {
        ApiService.getPriceData(address).then(setCurrentPriceData);
      }
    }
    console.log("Selected:", item.name || item.address);
  };

  const renderListItem = ({ item }: { item: AssetData | VideoData }) => {
    const isPitch = item.type === "pitch";
    const asset = item as AssetData;
    const pitch = item as VideoData;

    const itemName = isPitch ? `Pitch: ${pitch.address}` : asset.name;
    const itemSymbol = isPitch ? "🎞️" : asset.symbol;
    const itemValue = isPitch ? pitch.stats?.value || "N/A" : asset.value;
    const itemPriceChange = isPitch
      ? (Math.random() - 0.5) * 10
      : asset.priceChange;
    const itemLastUpdated = isPitch
      ? new Date(pitch.timestamp! * 1000).toLocaleDateString()
      : asset.lastUpdated;
    const itemShortAddress = isPitch
      ? pitch.address?.substring(0, 10) + "..."
      : asset.shortAddress;

    return (
      <TouchableOpacity onPress={() => handleAssetOrPitchSelect(item)}>
        <Frame style={styles.listItemFrame}>
          <Inbound style={styles.listItemInbound}>
            <View style={styles.listItemContent}>
              <Text style={styles.assetSymbol}>{itemSymbol}</Text>
              <View style={styles.assetDetails}>
                <Text style={styles.assetTitle} numberOfLines={1}>
                  {itemName}
                </Text>
                <Text style={styles.assetId}>{itemShortAddress}</Text>
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
            </View>
          </Inbound>
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
        <FlatList
          data={filteredData}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id!}
          style={styles.listContainer}
          contentContainerStyle={{ paddingBottom: 20, gap: 8 }}
        />
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
          />
        </View>
      );
    }
  };

  const GraphView = () => {
    const points = currentPriceData?.points || [];
    const maxValue = Math.max(...points.map((p) => p.value), 0);
    const minValue = Math.min(...points.map((p) => p.value), 0);
    const range = maxValue - minValue || 1;

    const screenWidth = Dimensions.get("window").width;
    const graphHeight = 180;

    const graphPoints = points.map((point, index) => {
      const x = (index / (points.length - 1)) * screenWidth;
      const y = graphHeight - ((point.value - minValue) / range) * graphHeight;
      return { x, y };
    });

    const pathData =
      graphPoints.length > 0
        ? graphPoints
            .map((point, index) =>
              index === 0
                ? `M ${point.x} ${point.y}`
                : `L ${point.x} ${point.y}`
            )
            .join(" ")
        : "";

    return (
      <Frame style={styles.graphContainer}>
        <Inbound style={styles.graphInner}>
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
                  <View style={styles.graphLine}>
                    {graphPoints.length > 1 && (
                      <View
                        style={[
                          styles.lineChart,
                          {
                            borderColor:
                              performance >= 0 ? "#4CAF50" : "#F44336",
                            height: graphHeight,
                          },
                        ]}
                      >
                        {graphPoints.map((point, index) => (
                          <View
                            key={index}
                            style={[
                              styles.dataPoint,
                              {
                                left: point.x,
                                top: point.y,
                                backgroundColor:
                                  performance >= 0 ? "#4CAF50" : "#F44336",
                              },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No price data available</Text>
            </View>
          )}
        </Inbound>
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

  if (!address && !isLoading) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Text style={styles.centeredMessageText}>
          No address provided to display assets.
        </Text>
      </View>
    );
  }

  const { isPlatform } = usePlatform();

  return (
    <SafeAreaView
      style={[styles.screenContainer, isPlatform("web") && { marginTop: 80 }]}
    >
      <View style={styles.wrapper512}>
        <ScrollView style={styles.scrollView}>
          <Outbound style={styles.headerOutbound}>
            <Frame style={styles.headerFrame}>
              <Inbound style={styles.headerInbound}>
                <View style={styles.addressBox}>
                  <Text style={styles.addressText}>{address}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.totalValueLabel}>
                    Total Portfolio Value
                  </Text>
                  <Text style={styles.totalValue}>${totalValue}</Text>
                </View>
                <View style={styles.actionsContainer}>
                  <Button
                    title="Buy"
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                  <Button
                    title="Sell"
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                  <Button
                    title="DAO"
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                </View>
              </Inbound>
            </Frame>
          </Outbound>

          <Outbound style={styles.graphOutbound}>
            <GraphView />
          </Outbound>

          <Outbound style={styles.searchSwitchOutbound}>
            <Frame style={styles.searchSwitchFrame}>
              <Inbound style={styles.searchSwitchInbound}>
                <Field
                  placeholder="Search Assets or Pitches"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <Switch>
                  <Switch.Tab
                    tab={{ key: "map", label: "🗺 Map" }}
                    active={viewMode === "map"}
                    onPress={() => setViewMode("map")}
                  />
                  <Switch.Tab
                    tab={{ key: "list", label: "📄 List" }}
                    active={viewMode === "list"}
                    onPress={() => setViewMode("list")}
                  />
                </Switch>
              </Inbound>
            </Frame>

            <View style={styles.assetsContentContainer}>
              {isLoading && (assets.length > 0 || pitches.length > 0) ? (
                <Text style={styles.loadingText}>Updating...</Text>
              ) : (
                <AssetsContent />
              )}
            </View>
          </Outbound>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  wrapper512: {
    maxWidth: 512,
    width: "100%",
    alignSelf: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  headerOutbound: {
    marginHorizontal: 12,
    marginTop: 12,
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
    borderRadius: 6,
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
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  totalValue: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  searchSwitchOutbound: {
    marginHorizontal: 12,
    marginTop: 8,
  },
  searchSwitchFrame: {
    borderRadius: 16,
  },
  searchSwitchInbound: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
  assetsContentContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 8,
    minHeight: 200,
  },
  listContainer: {},
  listItemFrame: {
    borderRadius: 8,
    marginBottom: 0,
  },
  listItemInbound: {
    padding: 10,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
  },
  cellGridStyle: {},
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
});

export default AssetsScreen;
