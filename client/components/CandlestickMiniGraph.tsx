import React, { useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { getChangeColor } from '../utils/colors';

type CandlestickMiniGraphProps = {
  prices: number[];
  style?: StyleProp<ViewStyle>;
};

const CandlestickMiniGraph = ({ prices, style }: CandlestickMiniGraphProps) => {
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const backgroundColor = prices && prices.length > 1
    ? getChangeColor(((prices[prices.length - 1] - prices[0]) / (prices[0] || 1)) * 100)
    : 'rgba(255,255,255,0.1)';

  if (!prices || prices.length < 2) {
    return (
      <View
        style={[styles.container, style, { backgroundColor }]}
      />
    );
  }

  // Wait for container layout before drawing
  const { width: containerWidth, height: containerHeight } = layout;
  if (containerWidth === 0 || containerHeight === 0) {
    return (
      <View
        style={[styles.container, style, { backgroundColor }]}
        onLayout={(e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout)}
      />
    );
  }

  // Calculate positions using measured size
  const startHeight = containerHeight * 0.4; // 40% from bottom
  const usableHeight = containerHeight - startHeight;
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const barWidth = containerWidth / (prices.length - 1);

  const candlesticks = prices.slice(0, prices.length - 1).map((openPrice, i) => {
    const closePrice = prices[i + 1];
    const high = Math.max(openPrice, closePrice);
    const low = Math.min(openPrice, closePrice);
    const highPos = containerHeight - (startHeight + ((high - minPrice) / priceRange) * usableHeight);
    const lowPos = containerHeight - (startHeight + ((low - minPrice) / priceRange) * usableHeight);
    const openPos = containerHeight - (startHeight + ((openPrice - minPrice) / priceRange) * usableHeight);
    const closePos = containerHeight - (startHeight + ((closePrice - minPrice) / priceRange) * usableHeight);
    const bodyHeight = Math.abs(closePos - openPos) || 1;
    const bodyTop = Math.min(openPos, closePos);
    const wickHeight = lowPos - highPos;
    return { key: i, left: i * barWidth, wickTop: highPos, wickHeight, bodyTop, bodyHeight };
  });

  return (
    <View
      style={[styles.container, style, { backgroundColor }]}
      onLayout={(e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout)}
    >
      {candlesticks.map((candle) => (
        <View key={candle.key}>
          <View
            style={[
              styles.backgroundBar,
              { left: candle.left + barWidth * 0.2, width: barWidth * 0.6, height: containerHeight },
            ]}
          />
          <View
            style={[
              styles.wick,
              { left: candle.left + barWidth / 2 - 0.5, top: candle.wickTop, height: candle.wickHeight },
            ]}
          />
          <View
            style={[
              styles.body,
              { left: candle.left + barWidth * 0.2, top: candle.bodyTop, height: candle.bodyHeight, width: barWidth * 0.6 },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundBar: {
    position: 'absolute',
    height: '100%',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 999,
  },
  wick: {
    position: 'absolute',
    width: 1,
    backgroundColor: '#FFFFFF',
  },
  body: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
});

export default React.memo(CandlestickMiniGraph);