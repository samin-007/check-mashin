/**
 * نشانگر امتیاز — مثل سرعت‌سنج ماشین
 * نمایش امتیاز سلامت آگهی از ۰ تا ۱۰۰
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme';

const ScoreIndicator = ({ score, size = 'md', label }) => {
  const getColor = (s) => {
    if (s >= 75) return colors.status.safe;
    if (s >= 50) return colors.status.warning;
    return colors.status.danger;
  };

  const getLabel = (s) => {
    if (s >= 75) return 'سالم';
    if (s >= 50) return 'احتیاط';
    return 'خطرناک';
  };

  const color = getColor(score);
  const statusLabel = label || getLabel(score);

  const dimensions = {
    sm: { size: 60, fontSize: 18, labelSize: 10 },
    md: { size: 90, fontSize: 28, labelSize: 12 },
    lg: { size: 120, fontSize: 36, labelSize: 14 },
  };

  const dim = dimensions[size];

  return (
    <View style={[styles.container, { width: dim.size, height: dim.size }]}>
      <View
        style={[
          styles.outerRing,
          {
            width: dim.size,
            height: dim.size,
            borderRadius: dim.size / 2,
            borderColor: color,
          },
        ]}
      >
        <View
          style={[
            styles.innerCircle,
            {
              width: dim.size - 8,
              height: dim.size - 8,
              borderRadius: (dim.size - 8) / 2,
            },
          ]}
        >
          <Text style={[styles.score, { fontSize: dim.fontSize, color }]}>
            {score}
          </Text>
          <Text style={[styles.label, { fontSize: dim.labelSize, color }]}>
            {statusLabel}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontWeight: '800',
  },
  label: {
    marginTop: 2,
    fontWeight: '600',
  },
});

export default ScoreIndicator;
