/**
 * کارت فرصت — نمایش آگهی‌های زیر قیمت بازار
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import PriceTag from './PriceTag';
import ScoreIndicator from './ScoreIndicator';
import { colors, typography, spacing, borderRadius } from '@theme';

const OpportunityCard = ({ opportunity, onPress }) => {
  const {
    carName,
    year,
    city,
    price,
    marketPrice,
    healthScore,
    timeAgo,
    discount,
  } = opportunity;

  return (
    <Card variant="highlighted" onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.carInfo}>
          <Text style={styles.carName}>{carName}</Text>
          <Text style={styles.details}>
            مدل {year} • {city}
          </Text>
        </View>
        <ScoreIndicator score={healthScore} size="sm" />
      </View>

      <View style={styles.priceRow}>
        <PriceTag price={price} comparePrice={marketPrice} size="md" />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>📉 {discount}٪ زیر بازار</Text>
        </View>
        <Text style={styles.timeAgo}>⚡ {timeAgo}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    ...typography.h4,
    color: colors.text.primary,
  },
  details: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  priceRow: {
    marginTop: spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
  },
  discountBadge: {
    backgroundColor: `${colors.status.safe}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    ...typography.captionBold,
    color: colors.status.safe,
  },
  timeAgo: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});

export default OpportunityCard;
