/**
 * صفحه فرصت‌ها — وصل به API واقعی
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Card, OpportunityCard } from '../components';
import { useOpportunities } from '../hooks';
import { colors, typography, spacing, borderRadius } from '../theme';

const FILTERS = ['همه', 'بالای ۷٪', 'امتیاز بالا', 'تهران'];

const OpportunitiesScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('همه');
  
  // پارامترهای فیلتر
  const getParams = () => {
    switch (activeFilter) {
      case 'بالای ۷٪': return { min_discount: 7, limit: 30 };
      case 'تهران': return { city: 'تهران', min_discount: 5, limit: 30 };
      default: return { min_discount: 5, limit: 30 };
    }
  };

  const { data: opportunities, loading, refetch } = useOpportunities(getParams());

  const renderOpportunity = ({ item }) => (
    <View style={styles.cardWrapper}>
      <OpportunityCard
        opportunity={{
          ...item,
          carName: item.car_name,
          healthScore: item.health_score,
          timeAgo: item.time_ago,
          marketPrice: item.market_price,
        }}
        onPress={() => navigation?.navigate('چک آگهی', { link: item.url })}
      />
    </View>
  );

  // آمار
  const totalOpps = opportunities?.length || 0;
  const avgDiscount = totalOpps > 0 
    ? Math.round(opportunities.reduce((sum, o) => sum + (o.discount || 0), 0) / totalOpps)
    : 0;
  const avgScore = totalOpps > 0
    ? Math.round(opportunities.reduce((sum, o) => sum + (o.health_score || 0), 0) / totalOpps)
    : 0;

  return (
    <View style={styles.container}>
      {/* هدر */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>فرصت‌ها</Text>
        <Text style={styles.headerSubtitle}>{totalOpps} فرصت فعال</Text>
      </View>

      {/* فیلترها */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
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
          <Text style={styles.summaryNumber}>{totalOpps}</Text>
          <Text style={styles.summaryLabel}>فرصت</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryNumber, { color: colors.status.safe }]}>٪{avgDiscount}</Text>
          <Text style={styles.summaryLabel}>میانگین تخفیف</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{avgScore}</Text>
          <Text style={styles.summaryLabel}>میانگین امتیاز</Text>
        </Card>
      </View>

      {/* لیست */}
      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ padding: spacing.huge }} />
      ) : opportunities && opportunities.length > 0 ? (
        <FlatList
          data={opportunities}
          renderItem={renderOpportunity}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>فرصتی با این فیلتر پیدا نشد</Text>
          <Text style={styles.emptySubtext}>فیلتر دیگه‌ای امتحان کن یا بعداً چک کن</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.secondary },
  headerTitle: { ...typography.h3, color: colors.text.primary },
  headerSubtitle: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },

  filterRow: { maxHeight: 50, marginTop: spacing.md },
  filterContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.background.secondary, borderWidth: 1, borderColor: colors.border.primary, marginRight: spacing.sm },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { ...typography.label, color: colors.text.secondary },
  filterTextActive: { color: colors.text.inverse },

  summaryRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  summaryCard: { flex: 1, padding: spacing.md, alignItems: 'center' },
  summaryNumber: { ...typography.h3, color: colors.primary },
  summaryLabel: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },

  listContent: { padding: spacing.lg, paddingBottom: 100 },
  cardWrapper: { marginBottom: spacing.md },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.huge },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { ...typography.h4, color: colors.text.secondary },
  emptySubtext: { ...typography.bodySmall, color: colors.text.tertiary, marginTop: spacing.sm },
});

export default OpportunitiesScreen;
