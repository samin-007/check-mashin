/**
 * صفحه بازار — قیمت روز + روند + شاخص‌ها
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Header, Card } from '@components';
import { colors, typography, spacing, borderRadius } from '@theme';

// داده‌های نمونه
const MOCK_PRICES = [
  { id: '1', name: 'پژو ۲۰۷ اتوماتیک', year: '۱۴۰۲', price: '۱,۲۸۰', change: +2.3, volume: 145 },
  { id: '2', name: 'دنا پلاس توربو', year: '۱۴۰۲', price: '۱,۳۵۰', change: +1.8, volume: 98 },
  { id: '3', name: 'تارا اتوماتیک', year: '۱۴۰۳', price: '۱,۵۳۰', change: -0.5, volume: 67 },
  { id: '4', name: 'کوییک R', year: '۱۴۰۲', price: '۷۹۰', change: +4.8, volume: 210 },
  { id: '5', name: 'شاهین G', year: '۱۴۰۳', price: '۹۲۰', change: +1.2, volume: 89 },
  { id: '6', name: 'هایما S7', year: '۱۴۰۱', price: '۱,۰۸۰', change: -2.1, volume: 45 },
  { id: '7', name: 'پراید ۱۱۱', year: '۱۳۹۸', price: '۳۸۰', change: -2.3, volume: 320 },
  { id: '8', name: 'پژو پارس', year: '۱۴۰۱', price: '۸۵۰', change: +3.0, volume: 180 },
];

const MarketScreen = () => {
  const [sortBy, setSortBy] = useState('change'); // change, price, volume

  const sortedPrices = [...MOCK_PRICES].sort((a, b) => {
    if (sortBy === 'change') return b.change - a.change;
    return 0;
  });

  return (
    <View style={styles.container}>
      <Header title="بازار" subtitle="قیمت روز و روند بازار خودرو" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* شاخص کل */}
        <View style={styles.indexSection}>
          <Card style={styles.indexCard}>
            <Text style={styles.indexLabel}>شاخص کل بازار خودرو</Text>
            <View style={styles.indexRow}>
              <Text style={styles.indexValue}>۱۲,۴۵۰</Text>
              <View style={[styles.indexBadge, { backgroundColor: `${colors.status.safe}20` }]}>
                <Text style={[styles.indexChange, { color: colors.status.safe }]}>
                  +۲.۱٪ ▲
                </Text>
              </View>
            </View>
            <Text style={styles.indexCaption}>نسبت به دیروز</Text>
          </Card>
        </View>

        {/* مقایسه سریع */}
        <View style={styles.compareSection}>
          <Text style={styles.sectionTitle}>📈 مقایسه بازارها (۳ ماه اخیر)</Text>
          <View style={styles.compareRow}>
            <Card style={styles.compareCard}>
              <Text style={styles.compareIcon}>🚗</Text>
              <Text style={styles.compareName}>خودرو</Text>
              <Text style={[styles.compareValue, { color: colors.status.safe }]}>+۱۲٪</Text>
            </Card>
            <Card style={styles.compareCard}>
              <Text style={styles.compareIcon}>💵</Text>
              <Text style={styles.compareName}>دلار</Text>
              <Text style={[styles.compareValue, { color: colors.status.safe }]}>+۸٪</Text>
            </Card>
            <Card style={styles.compareCard}>
              <Text style={styles.compareIcon}>🪙</Text>
              <Text style={styles.compareName}>طلا</Text>
              <Text style={[styles.compareValue, { color: colors.status.safe }]}>+۱۵٪</Text>
            </Card>
            <Card style={styles.compareCard}>
              <Text style={styles.compareIcon}>📊</Text>
              <Text style={styles.compareName}>بورس</Text>
              <Text style={[styles.compareValue, { color: colors.status.safe }]}>+۳٪</Text>
            </Card>
          </View>
        </View>

        {/* جدول قیمت */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <Text style={styles.sectionTitle}>💰 قیمت روز</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortBtn, sortBy === 'change' && styles.sortBtnActive]}
                onPress={() => setSortBy('change')}
              >
                <Text style={[styles.sortBtnText, sortBy === 'change' && styles.sortBtnTextActive]}>
                  تغییرات
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* هدر جدول */}
          <View style={styles.rowHeader}>
            <Text style={[styles.colHeader, { flex: 2 }]}>مدل</Text>
            <Text style={styles.colHeader}>قیمت (م.ت)</Text>
            <Text style={styles.colHeader}>تغییر</Text>
            <Text style={styles.colHeader}>آگهی</Text>
          </View>

          {/* ردیف‌ها */}
          {sortedPrices.map((car) => (
            <TouchableOpacity key={car.id} style={styles.row}>
              <View style={{ flex: 2 }}>
                <Text style={styles.rowName}>{car.name}</Text>
                <Text style={styles.rowYear}>مدل {car.year}</Text>
              </View>
              <Text style={styles.rowPrice}>{car.price}</Text>
              <View style={styles.rowChangeWrapper}>
                <Text style={[
                  styles.rowChange,
                  { color: car.change >= 0 ? colors.status.safe : colors.status.danger }
                ]}>
                  {car.change >= 0 ? '+' : ''}{car.change}٪
                </Text>
              </View>
              <Text style={styles.rowVolume}>{car.volume}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // شاخص
  indexSection: {
    padding: spacing.lg,
  },
  indexCard: {
    padding: spacing.xl,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  indexLabel: {
    ...typography.label,
    color: colors.text.secondary,
  },
  indexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  indexValue: {
    ...typography.h1,
    color: colors.text.primary,
  },
  indexBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  indexChange: {
    ...typography.bodyBold,
  },
  indexCaption: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },

  // مقایسه
  compareSection: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  compareRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  compareCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  compareIcon: {
    fontSize: 20,
  },
  compareName: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  compareValue: {
    ...typography.bodyBold,
    marginTop: spacing.xs,
  },

  // جدول
  tableSection: {
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.secondary,
  },
  sortBtnActive: {
    backgroundColor: colors.primary,
  },
  sortBtnText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  sortBtnTextActive: {
    color: colors.text.inverse,
  },
  rowHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  colHeader: {
    ...typography.captionBold,
    color: colors.text.tertiary,
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  rowName: {
    ...typography.bodyBold,
    color: colors.text.primary,
    fontSize: 13,
  },
  rowYear: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  rowPrice: {
    ...typography.number,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  rowChangeWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  rowChange: {
    ...typography.captionBold,
  },
  rowVolume: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    textAlign: 'center',
  },
});

export default MarketScreen;
