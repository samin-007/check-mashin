/**
 * صفحه فرصت‌های امروز — لیست آگهی‌های زیر قیمت بازار
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Header, Card, OpportunityCard } from '@components';
import { colors, typography, spacing, borderRadius } from '@theme';

// داده‌های نمونه
const MOCK_OPPORTUNITIES = [
  {
    id: '1',
    carName: 'پژو ۲۰۷ اتوماتیک',
    year: '۱۴۰۲',
    city: 'تهران',
    price: 1180,
    marketPrice: 1280,
    healthScore: 85,
    timeAgo: '۲ ساعت پیش',
    discount: 8,
  },
  {
    id: '2',
    carName: 'دنا پلاس توربو',
    year: '۱۴۰۲',
    city: 'اصفهان',
    price: 1250,
    marketPrice: 1350,
    healthScore: 78,
    timeAgo: '۴ ساعت پیش',
    discount: 7,
  },
  {
    id: '3',
    carName: 'تارا اتوماتیک',
    year: '۱۴۰۳',
    city: 'تهران',
    price: 1420,
    marketPrice: 1530,
    healthScore: 92,
    timeAgo: '۳۰ دقیقه پیش',
    discount: 7,
  },
  {
    id: '4',
    carName: 'هایما S7 توربو',
    year: '۱۴۰۱',
    city: 'کرج',
    price: 980,
    marketPrice: 1080,
    healthScore: 71,
    timeAgo: '۵ ساعت پیش',
    discount: 9,
  },
  {
    id: '5',
    carName: 'کوییک R اتوماتیک',
    year: '۱۴۰۲',
    city: 'تهران',
    price: 720,
    marketPrice: 790,
    healthScore: 88,
    timeAgo: '۱ ساعت پیش',
    discount: 9,
  },
  {
    id: '6',
    carName: 'شاهین G',
    year: '۱۴۰۳',
    city: 'شیراز',
    price: 850,
    marketPrice: 920,
    healthScore: 80,
    timeAgo: '۳ ساعت پیش',
    discount: 8,
  },
];

const FILTERS = ['همه', 'بالای ۵٪ تخفیف', 'امتیاز بالا', 'تهران', 'امروز'];

const OpportunitiesScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('همه');

  const renderOpportunity = ({ item }) => (
    <View style={styles.cardWrapper}>
      <OpportunityCard
        opportunity={item}
        onPress={() => navigation?.navigate('CheckResult', { opportunity: item })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="فرصت‌ها"
        subtitle={`${MOCK_OPPORTUNITIES.length} فرصت فعال`}
      />

      {/* فیلترها */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* خلاصه */}
      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>۲۳</Text>
          <Text style={styles.summaryLabel}>فرصت امروز</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: colors.status.safe }]}>٪۸</Text>
          <Text style={styles.summaryLabel}>میانگین تخفیف</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>۸۵</Text>
          <Text style={styles.summaryLabel}>میانگین امتیاز</Text>
        </Card>
      </View>

      {/* لیست فرصت‌ها */}
      <FlatList
        data={MOCK_OPPORTUNITIES}
        renderItem={renderOpportunity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // فیلتر
  filterRow: {
    maxHeight: 50,
    marginTop: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.label,
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.inverse,
  },

  // خلاصه
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  summaryNumber: {
    ...typography.h3,
    color: colors.primary,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  // لیست
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: spacing.md,
  },
});

export default OpportunitiesScreen;
