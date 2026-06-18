/**
 * Skeleton Loading — انیمیشن لودینگ مثل اپ‌های حرفه‌ای
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

const Skeleton = ({ width = '100%', height = 20, borderRadiusVal = 8, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius: borderRadiusVal, opacity },
        style,
      ]}
    />
  );
};

export const SkeletonCard = () => (
  <View style={styles.card}>
    <View style={styles.cardRow}>
      <View style={{ flex: 1 }}>
        <Skeleton width="60%" height={18} />
        <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
      </View>
      <Skeleton width={50} height={50} borderRadiusVal={25} />
    </View>
    <Skeleton width="80%" height={24} style={{ marginTop: 16 }} />
    <View style={[styles.cardRow, { marginTop: 12 }]}>
      <Skeleton width="30%" height={20} borderRadiusVal={10} />
      <Skeleton width="25%" height={14} />
    </View>
  </View>
);

export const SkeletonMarket = () => (
  <View style={styles.marketSkeleton}>
    <Skeleton width="100%" height={80} borderRadiusVal={16} />
    <View style={[styles.cardRow, { marginTop: 12 }]}>
      <Skeleton width="30%" height={60} borderRadiusVal={12} />
      <Skeleton width="30%" height={60} borderRadiusVal={12} />
      <Skeleton width="30%" height={60} borderRadiusVal={12} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.background.elevated,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketSkeleton: {
    padding: spacing.lg,
  },
});

export default Skeleton;
