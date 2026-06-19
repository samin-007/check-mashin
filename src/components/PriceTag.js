/**
 * تگ قیمت — نمایش قیمت با فرمت ایرانی
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme';

const PriceTag = ({ price, comparePrice, size = 'md', showDiff = true }) => {
  // فرمت کردن قیمت (ورودی: میلیون تومان)
  const formatPrice = (p) => {
    if (p >= 10000) {
      // بالای ۱۰ میلیارد
      return `${(p / 1000).toFixed(1)} میلیارد`;
    } else if (p >= 1000) {
      // بین ۱ تا ۱۰ میلیارد
      const b = Math.floor(p / 1000);
      const m = p % 1000;
      if (m === 0) return `${b} میلیارد`;
      return `${b} میلیارد و ${m} میلیون`;
    }
    // زیر ۱ میلیارد
    return `${p.toLocaleString('fa-IR')} میلیون`;
  };

  // محاسبه درصد اختلاف
  const getDiff = () => {
    if (!comparePrice || !showDiff) return null;
    const diff = ((price - comparePrice) / comparePrice) * 100;
    return diff;
  };

  const diff = getDiff();
  const isBelow = diff && diff < 0;
  const isAbove = diff && diff > 0;

  const textSize = size === 'lg' ? typography.price : size === 'md' ? typography.priceSmall : typography.bodyBold;

  return (
    <View style={styles.container}>
      <Text style={[styles.price, textSize]}>{formatPrice(price)}</Text>
      <Text style={[styles.currency, size === 'sm' && styles.currencySmall]}>تومان</Text>
      
      {diff !== null && (
        <View style={[styles.badge, isBelow ? styles.badgeBelow : styles.badgeAbove]}>
          <Text style={[styles.badgeText, isBelow ? styles.badgeTextBelow : styles.badgeTextAbove]}>
            {isBelow ? '▼' : '▲'} {Math.abs(diff).toFixed(0)}٪ {isBelow ? 'زیر بازار' : 'بالای بازار'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  price: {
    color: colors.text.primary,
  },
  currency: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
  currencySmall: {
    ...typography.caption,
  },
  badge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeBelow: {
    backgroundColor: `${colors.status.safe}20`,
  },
  badgeAbove: {
    backgroundColor: `${colors.status.danger}20`,
  },
  badgeText: {
    ...typography.captionBold,
  },
  badgeTextBelow: {
    color: colors.status.safe,
  },
  badgeTextAbove: {
    color: colors.status.danger,
  },
});

export default PriceTag;
