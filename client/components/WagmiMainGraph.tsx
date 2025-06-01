import { useState, memo } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import {
  LineChart,
  useLineChart,
} from 'react-native-wagmi-charts';
import { PriceDataPoint } from '../data/api';
import RNText from './Text';

type WagmiMainGraphProps = {
  data: PriceDataPoint[];
};

const TopIndicators = () => {
  return (
    <View style={styles.topIndicatorsContainer}>
      <LineChart.PriceText style={styles.topIndicatorText} />
      <LineChart.DatetimeText style={styles.topIndicatorText} />
    </View>
  );
};

const RightAxisAndGrid = () => {
  const { data: chartData, yDomain } = useLineChart();
  if (!chartData || chartData.length === 0) return null;

  const minPrice = yDomain?.min ?? 0;
  const maxPrice = yDomain?.max ?? 0;
  const midPrice = (maxPrice + minPrice) / 2;

  return (
    <>
      <LineChart.HorizontalLine at={{ value: maxPrice }} color={styles.gridLineStyle.color} />
      <LineChart.HorizontalLine at={{ value: midPrice }} color={styles.gridLineStyle.color} />
      <LineChart.HorizontalLine at={{ value: minPrice }} color={styles.gridLineStyle.color} />

      <View style={styles.yAxisContainerRight}>
        <RNText style={styles.yAxisLabelRight}>{maxPrice.toFixed(2)}</RNText>
        <RNText style={styles.yAxisLabelRight}>{midPrice.toFixed(2)}</RNText>
        <RNText style={styles.yAxisLabelRight}>{minPrice.toFixed(2)}</RNText>
      </View>
    </>
  );
};

const WagmiMainGraph = ({ data }: WagmiMainGraphProps) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <RNText style={styles.noDataText}>No price data</RNText>
        </View>
      </View>
    );
  }

  const lineChartData = data.map((point) => ({
    timestamp: point.timestamp * 1000,
    value: point.value,
  }));

  const topIndicatorsHeight = 30;
  const actualChartHeight = containerHeight - topIndicatorsHeight;

  return (
    <View
      style={styles.container}
      onLayout={(e: LayoutChangeEvent) => {
        setContainerHeight(e.nativeEvent.layout.height);
        setContainerWidth(e.nativeEvent.layout.width);
      }}
    >
      <LineChart.Provider data={lineChartData}>
        <TopIndicators />

        <View style={styles.chartContainer}>
          {actualChartHeight > 0 && containerWidth > 0 && (
            <LineChart width={containerWidth} height={actualChartHeight}>
              <LineChart.Path color="white" />
              <LineChart.CursorCrosshair color="lightgrey">
                <LineChart.Tooltip
                  textStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: 4,
                    color: 'white',
                    fontSize: 18,
                    padding: 4,
                  }}
                />
              </LineChart.CursorCrosshair>
              <RightAxisAndGrid />
            </LineChart>
          )}
        </View>
      </LineChart.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  topIndicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 30,
    alignItems: 'center',
  },
  topIndicatorText: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  chartContainer: {
    flex: 1,
    width: '100%',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noDataText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  yAxisContainerRight: {
    position: 'absolute',
    right: 5,
    top: 0,
    bottom: 0,
    width: 'auto',
    minWidth: 40,
    justifyContent: 'space-between',
    paddingVertical: 10,
    zIndex: 10,
  },
  yAxisLabelRight: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  gridLineStyle: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
});

export default memo(WagmiMainGraph);