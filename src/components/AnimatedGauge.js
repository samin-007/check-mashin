/**
 * AnimatedGauge — گیج انیمیشن‌دار مثل سرعت‌سنج ماشین
 * نمایش امتیاز سلامت آگهی با انیمیشن چرخشی
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing } from '@theme';

const AnimatedGauge = ({
  score = 0,           // 0-100
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

  // محاسبه progress bar width
  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const displayScore = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* حلقه بیرونی */}
      <View style={[styles.outerRing, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: thickness,
        borderColor: `${color}20`,
      }]}>
        {/* حلقه progress */}
        <View style={[styles.progressRing, {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: color,
          borderRightColor: 'transparent',
          borderBottomColor: score > 50 ? color : 'transparent',
          transform: [{ rotate: '-45deg' }],
        }]} />
      </View>

      {/* متن مرکزی */}
      <View style={styles.center}>
        <View style={[styles.innerCircle, {
          width: size - thickness * 2 - 12,
          height: size - thickness * 2 - 12,
          borderRadius: (size - thickness * 2 - 12) / 2,
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
      </View>

      {/* glow effect */}
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
  outerRing: {
    position: 'absolute',
  },
  progressRing: {
    position: 'absolute',
    top: -10,
    left: -10,
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.secondary,
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
