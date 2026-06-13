/**
 * StatusBadge — بج وضعیت آگهی
 * نمایش نتیجه نهایی: فرصت، منصفانه، گران، کلاهبرداری
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme';

const StatusBadge = ({ status, size = 'md', animated = true }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const configs = {
    opportunity: {
      icon: '✓',
      text: 'فرصت خرید!',
      color: colors.status.safe,
      bgColor: `${colors.status.safe}15`,
    },
    fair: {
      icon: '●',
      text: 'قیمت منصفانه',
      color: colors.status.info,
      bgColor: `${colors.status.info}15`,
    },
    overpriced: {
      icon: '⚠',
      text: 'بالای بازار',
      color: colors.status.warning,
      bgColor: `${colors.status.warning}15`,
    },
    scam: {
      icon: '✗',
      text: 'مشکوک!',
      color: colors.status.danger,
      bgColor: `${colors.status.danger}15`,
    },
  };

  const config = configs[status] || configs.fair;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [status]);

  const sizeStyles = {
    sm: { paddingH: spacing.md, paddingV: spacing.xs, fontSize: 12, iconSize: 14 },
    md: { paddingH: spacing.lg, paddingV: spacing.sm, fontSize: 14, iconSize: 18 },
    lg: { paddingH: spacing.xl, paddingV: spacing.md, fontSize: 16, iconSize: 22 },
  };

  const s = sizeStyles[size];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: config.bgColor,
          borderColor: `${config.color}40`,
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={[styles.icon, { color: config.color, fontSize: s.iconSize }]}>
        {config.icon}
      </Text>
      <Text style={[styles.text, { color: config.color, fontSize: s.fontSize }]}>
        {config.text}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  text: {
    fontWeight: '700',
  },
});

export default StatusBadge;
