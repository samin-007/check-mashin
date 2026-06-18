/**
 * صفحه بازار — وصل به API واقعی
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../components';
import { useMarketIndex, useCars } from '../hooks';
import { MarketAPI } from '../services/api';
import { colors, typography, spacing, borderRadius } from '../theme';

const MarketScreen = () => {
  const { data: marketData, loading: indexLoading } = useMarketIndex();
  const { data: cars, loading: carsLoading } = useCars({ sort_by: 'price_change_weekly', order: 'desc', limit: 20 });
  const [compare, setCompare] = useState(null);

  // دریافت مقایسه بازارها
  React.useEffect(() => {
    MarketAPI.getCompare().then(setCompare);
  }, []);

  return (
    <View style={styles.container}>
      {/* هدر */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>بازار</Text>
        <Text style={styles.headerSubtitle}>قیمت روز و روند بازار خودرو</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* شاخص کل */}
        {indexLoading ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ padding: spacing.huge }} />
        ) : marketData && (
          <View style={styles.indexSection}>
            <Card style={styles.indexCard}>
              <Text style={styles.indexLabel}>شاخص کل بازار خودرو</Text>
              <View style={styles.indexRow}>
                <Text style={styles.indexValue}>
                  {marketData.index_value?.toLocaleString('fa-IR') || '—'}
                </Text>
                <View style={[styles.indexBadge, { backgroundColor: marketData.index_change >= 0 ? `${colors.status.safe}20` : `${colors.status.danger}20` }]}>
                  <Text style={[styles.indexChange, { color: marketData.index_change >= 0 ? colors.status.safe : colors.status.danger }]}>
                    {marketData.index_change >= 0 ? '▲' : '▼'} {Math.abs(marketData.index_change)}٪
                  </Text>
                </View>
              </View>
              <Text style={styles.indexCaption}>نسبت به هفته قبل</Text>
            </Card>
          </View>
        )}

        {/* مقایسه بازارها */}
        {compare && (
          <View style={styles.compareSection}>
            <Text style={styles.sectionTitle}>📈 مقایسه بازارها (۳ ماه اخیر)</Text>
            <View style={styles.compareRow}>
              {compare.markets?.map((market, i) => (
                <Card key={i} style={styles.compareCard}>
                  <Text style={styles.compareIcon}>{market.icon}</Text>
                  <Text style={styles.compareName}>{market.name}</Text>
                  <Text style={[styles.compareValue, { color: market.change >= 0 ? colors.status.safe : colors.status.danger }]}>
                    {market.change >= 0 ? '+' : ''}{market.change}٪
                  </Text>
                </Card>
              ))}
            </View>
          </View>
        )}

        {/* جدول قیمت */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>💰 قیمت روز</Text>

          {/* هدر جدول */}
          <View style={styles.rowHeader}>
            <Text style={[styles.colHeader, { flex: 2 }]}>مدل</Text>
            <Text style={styles.colHeader}>قیمت (م.ت)</Text>
            <Text style={styles.colHeader}>تغییر</Text>
            <Text style={styles.colHeader}>آگهی</Text>
          </View>

          {carsLoading ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ padding: spacing.xl }} />
          ) : cars && cars.length > 0 ? (
            cars.map((car) => (
              <TouchableOpacity key={car.id} style={styles.row}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.rowName}>{car.brand} {car.model}</Text>
                  <Text style={styles.rowYear}>{car.trim} • مدل {car.year}</Text>
                </View>
                <Text style={styles.rowPrice}>
                  {car.market_price?.toLocaleString('fa-IR') || '—'}
                </Text>
                <View style={styles.rowChangeWrapper}>
                  <Text style={[styles.rowChange, { color: car.price_change_weekly >= 0 ? colors.status.safe : colors.status.danger }]}>
                    {car.price_change_weekly >= 0 ? '+' : ''}{car.price_change_weekly}٪
                  </Text>
                </View>
                <Text style={styles.rowVolume}>{car.ad_count}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>داده‌ای یافت نشد</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.secondary },
  headerTitle: { ...typography.h3, color: colors.text.primary },
  headerSubtitle: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  indexSection: { padding: spacing.lg },
  indexCard: { padding: spacing.xl, alignItems: 'center', borderColor: colors.primary, borderWidth: 1 },
  indexLabel: { ...typography.label, color: colors.text.secondary },
  indexRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.md },
  indexValue: { ...typography.h1, color: colors.text.primary },
  indexBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  indexChange: { ...typography.bodyBold },
  indexCaption: { ...typography.caption, color: colors.text.tertiary, marginTop: spacing.xs },

  compareSection: { paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.h4, color: colors.text.primary, marginBottom: spacing.md },
  compareRow: { flexDirection: 'row', gap: spacing.sm },
  compareCard: { flex: 1, padding: spacing.md, alignItems: 'center' },
  compareIcon: { fontSize: 20 },
  compareName: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },
  compareValue: { ...typography.bodyBold, marginTop: spacing.xs },

  tableSection: { padding: spacing.lg, marginTop: spacing.lg },
  rowHeader: { flexDirection: 'row', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border.primary },
  colHeader: { ...typography.captionBold, color: colors.text.tertiary, flex: 1, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.secondary },
  rowName: { ...typography.bodyBold, color: colors.text.primary, fontSize: 13 },
  rowYear: { ...typography.caption, color: colors.text.tertiary },
  rowPrice: { ...typography.number, color: colors.text.primary, flex: 1, textAlign: 'center', fontSize: 13 },
  rowChangeWrapper: { flex: 1, alignItems: 'center' },
  rowChange: { ...typography.captionBold },
  rowVolume: { ...typography.caption, color: colors.text.secondary, flex: 1, textAlign: 'center' },
  emptyText: { ...typography.body, color: colors.text.tertiary, textAlign: 'center', padding: spacing.xl },
});

export default MarketScreen;
