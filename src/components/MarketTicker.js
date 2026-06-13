/**
 * MarketTicker — نوار متحرک قیمت مثل بورس
 * نمایش تغییرات لحظه‌ای قیمت خودروها
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing } from '@theme';

const TICKER_DATA = [
  { name: '۲۰۷ AT', change: +2.3 },
  { name: 'دنا+', change: +1.8 },
  { name: 'تارا', change: -0.5 },
  { name: 'کوییک R', change: +4.8 },
  { name: 'شاهین', change: +1.2 },
  { name: 'هایما', change: -2.1 },
  { name: 'پارس', change: +3.0 },
  { name: 'پراید', change: -2.3 },
];

const MarketTicker = ({ data = TICKER_DATA }) => {
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const totalWidth = data.length * 120;
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -totalWidth,
        duration: data.length * 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.liveIcon}>●</Text>
        <Text style={styles.label}>بازار</Text>
      </View>
      
      <View style={styles.tickerWrapper}>
        <Animated.View
          style={[styles.ticker, { transform: [{ translateX: scrollAnim }] }]}
        >
          {/* دوبل کردن داده برای اسکرول بی‌نهایت */}
          {[...data, ...data].map((item, index) => (
            <View key={index} style={styles.tickerItem}>
              <Text style={styles.tickerName}>{item.name}</Text>
              <Text style={[
                styles.tickerChange,
                { color: item.change >= 0 ? colors.status.safe : colors.status.danger }
              ]}>
                {item.change >= 0 ? '▲' : '▼'}{Math.abs(item.change)}٪
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border.primary,
    marginRight: spacing.sm,
  },
  liveIcon: {
    color: colors.status.safe,
    fontSize: 8,
    marginRight: 4,
  },
  label: {
    ...typography.captionBold,
    color: colors.text.secondary,
  },
  tickerWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  ticker: {
    flexDirection: 'row',
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.xl,
    minWidth: 100,
  },
  tickerName: {
    ...typography.captionBold,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  tickerChange: {
    ...typography.captionBold,
    fontSize: 11,
  },
});

export default MarketTicker;
