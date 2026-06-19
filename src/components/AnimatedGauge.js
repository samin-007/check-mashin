/**
 * AnimatedGauge — گیج انیمیشن‌دار (فیکس شده: ۱۰۰ = کامل پر)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, spacing } from '../theme';

const AnimatedGauge = ({
  score = 0,
  size = 140,
  thickness = 10,
  animated = true,
  showLabel = true,
  label,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: score,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(score);
    }
  }, [score]);

  const getColor = (s) => {
    if (s >= 75) return colors.status.safe;
    if (s >= 50) return colors.status.warning;
    return colors.status.danger;
  };

  const getStatusText = (s) => {
    if (s >= 85) return 'عالی';
    if (s >= 75) return 'سالم';
    if (s >= 50) return 'احتیاط';
    if (s >= 25) return 'مشکوک';
    return 'خطرناک';
  };

  const color = getColor(score);
  const statusText = label || getStatusText(score);

  // محاسبه درصد پر شدن حلقه
  const percentage = Math.min(score, 100) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* حلقه پس‌زمینه */}
      <View style={[styles.ring, {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: thickness,
        borderColor: `${color}20`,
      }]} />

      {/* حلقه پر شده — بالا */}
      {percentage > 0 && (
        <View style={[styles.progressRing, {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: color,
          borderTopColor: percentage >= 0.25 ? color : 'transparent',
          borderRightColor: percentage >= 0.5 ? color : 'transparent',
          borderBottomColor: percentage >= 0.75 ? color : 'transparent',
          borderLeftColor: percentage >= 1 ? color : 'transparent',
          transform: [{ rotate: '-135deg' }],
        }]} />
      )}

      {/* دایره مرکزی */}
      <View style={[styles.center, {
        width: size - thickness * 2 - 8,
        height: size - thickness * 2 - 8,
        borderRadius: (size - thickness * 2 - 8) / 2,
      }]}>
        <Text style={[styles.score, { fontSize: size * 0.22, color }]}>
          {score}
        </Text>
        {showLabel && (
          <Text style={[styles.label, { fontSize: size * 0.09, color }]}>
            {statusText}
          </Text>
        )}
      </View>

      {/* افکت glow */}
      <View style={[styles.glow, {
        width: size + 20,
        height: size + 20,
        borderRadius: (size + 20) / 2,
        backgroundColor: `${color}08`,
      }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  progressRing: {
    position: 'absolute',
  },
  center: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.secondary,
    position: 'absolute',
  },
  score: {
    fontWeight: '800',
    letterSpacing: -1,
  },
  label: {
    fontWeight: '600',
    marginTop: 2,
    opacity: 0.9,
  },
  glow: {
    position: 'absolute',
    zIndex: -1,
  },
});

export default AnimatedGauge;
