/**
 * صفحه اصلی — داشبورد (وصل به API واقعی + Fallback Mock)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { Card, OpportunityCard, GradientCard, SearchBar, MarketTicker } from '../components';
import { useMarketIndex, useOpportunities } from '../hooks';
import { colors, typography, spacing, borderRadius } from '../theme';

const DashboardScreen = ({ navigation }) => {
  const [linkInput, setLinkInput] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);
  
  // داده از API
  const { data: marketData, loading: marketLoading } = useMarketIndex();
  const { data: opportunities, loading: oppsLoading } = useOpportunities({ min_discount: 5, limit: 5 });

  // انیمیشن‌ها
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleCheckLink = () => {
    if (!linkInput.trim()) return;
    navigation?.navigate('چک آگهی', { link: linkInput });
  };

  // Fallback data اگه API جواب نداد
  const indexValue = marketData?.index_value || '—';
  const indexChange = marketData?.index_change || 0;
  const totalAds = marketData?.total_ads || 0;
  const topGainers = marketData?.top_gainers || [];
  const topLosers = marketData?.top_losers || [];

  return (
    <View style={styles.container}>
      {/* هدر */}
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logoText}>CM</Text></View>
        <View>
          <Text style={styles.headerTitle}>چک‌ماشین</Text>
          <Text style={styles.headerSubtitle}>رادار فرصت خرید خودرو</Text>
        </View>
      </View>

      <MarketTicker />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero — چک آگهی */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <GradientCard variant="primary" glowing>
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>🔍</Text>
              <Text style={styles.heroTitle}>آگهی رو چک کن</Text>
              <Text style={styles.heroSubtitle}>لینک آگهی دیوار یا باما رو بده{'\n'}۳ ثانیه‌ای بهت می‌گیم: بخر یا فرار کن!</Text>
            </View>
            <SearchBar value={linkInput} onChangeText={setLinkInput} onSubmit={handleCheckLink} loading={checkLoading} placeholder="لینک آگهی رو بچسبون..." />
          </GradientCard>
        </Animated.View>

        {/* شاخص بازار */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 وضعیت بازار</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('بازار')}>
              <Text style={styles.seeAll}>بیشتر →</Text>
            </TouchableOpacity>
          </View>

          {marketLoading ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ padding: spacing.xl }} />
          ) : (
            <>
              <Card style={styles.indexCard}>
                <View style={styles.indexRow}>
                  <View>
                    <Text style={styles.indexLabel}>شاخص کل خودرو</Text>
                    <View style={styles.indexValueRow}>
                      <Text style={styles.indexValue}>{typeof indexValue === 'number' ? indexValue.toLocaleString('fa-IR') : indexValue}</Text>
                      <View style={[styles.changeBadge, { backgroundColor: indexChange >= 0 ? `${colors.status.safe}20` : `${colors.status.danger}20` }]}>
                        <Text style={[styles.changeText, { color: indexChange >= 0 ? colors.status.safe : colors.status.danger }]}>
                          {indexChange >= 0 ? '▲' : '▼'} {Math.abs(indexChange)}٪
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.miniChart}>
                    <View style={[styles.chartBar, { height: 15 }]} />
                    <View style={[styles.chartBar, { height: 22 }]} />
                    <View style={[styles.chartBar, { height: 18 }]} />
                    <View style={[styles.chartBar, { height: 28 }]} />
                    <View style={[styles.chartBar, { height: 24 }]} />
                    <View style={[styles.chartBar, { height: 32 }]} />
                    <View style={[styles.chartBar, { height: 38, backgroundColor: colors.primary }]} />
                  </View>
                </View>
              </Card>

              {/* top gainers/losers */}
              <View style={styles.miniCards}>
                {topGainers[0] && (
                  <Card style={styles.miniCard}>
                    <Text style={styles.miniCardIcon}>📈</Text>
                    <Text style={styles.miniCardValue}>{topGainers[0].model}</Text>
                    <Text style={[styles.miniCardChange, { color: colors.status.safe }]}>+{topGainers[0].price_change_weekly}٪</Text>
                  </Card>
                )}
                {topLosers[0] && (
                  <Card style={styles.miniCard}>
                    <Text style={styles.miniCardIcon}>📉</Text>
                    <Text style={styles.miniCardValue}>{topLosers[0].model}</Text>
                    <Text style={[styles.miniCardChange, { color: colors.status.danger }]}>{topLosers[0].price_change_weekly}٪</Text>
                  </Card>
                )}
                <Card style={styles.miniCard}>
                  <Text style={styles.miniCardIcon}>🔥</Text>
                  <Text style={styles.miniCardValue}>{opportunities?.length || 0}</Text>
                  <Text style={styles.miniCardLabel}>فرصت</Text>
                </Card>
              </View>
            </>
          )}
        </View>

        {/* فرصت‌ها */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 فرصت‌های داغ</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('فرصت‌ها')}>
              <Text style={styles.seeAll}>همه →</Text>
            </TouchableOpacity>
          </View>

          {oppsLoading ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ padding: spacing.xl }} />
          ) : opportunities && opportunities.length > 0 ? (
            opportunities.map((opp) => (
              <View key={opp.id} style={styles.oppCardWrapper}>
                <OpportunityCard
                  opportunity={{
                    ...opp,
                    carName: opp.car_name,
                    healthScore: opp.health_score,
                    timeAgo: opp.time_ago,
                  }}
                  onPress={() => navigation?.navigate('چک آگهی', { link: opp.url })}
                />
              </View>
            ))
          ) : (
            <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={{ ...typography.body, color: colors.text.secondary }}>
                فرصتی فعلاً پیدا نشده — بعداً چک کن!
              </Text>
            </Card>
          )}
        </View>

        {/* آمار */}
        <View style={styles.section}>
          <GradientCard variant="dark">
            <Text style={styles.statsTitle}>📋 آمار بازار</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalAds || '—'}</Text>
                <Text style={styles.statLabel}>آگهی رصدشده</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.status.safe }]}>{opportunities?.length || 0}</Text>
                <Text style={styles.statLabel}>فرصت</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.text.primary }]}>{marketData?.total_cars || 0}</Text>
                <Text style={styles.statLabel}>مدل خودرو</Text>
              </View>
            </View>
          </GradientCard>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.secondary },
  logoBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  logoText: { color: colors.text.inverse, fontWeight: '800', fontSize: 14 },
  headerTitle: { ...typography.h3, color: colors.text.primary },
  headerSubtitle: { ...typography.caption, color: colors.text.secondary },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  heroSection: { padding: spacing.lg },
  heroContent: { alignItems: 'center', marginBottom: spacing.xl },
  heroEmoji: { fontSize: 40, marginBottom: spacing.sm },
  heroTitle: { ...typography.h2, color: colors.text.primary, textAlign: 'center' },
  heroSubtitle: { ...typography.bodySmall, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xs, lineHeight: 22 },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { ...typography.h4, color: colors.text.primary },
  seeAll: { ...typography.label, color: colors.primary },

  indexCard: { padding: spacing.lg, borderColor: `${colors.primary}30` },
  indexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  indexLabel: { ...typography.caption, color: colors.text.secondary },
  indexValueRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.sm },
  indexValue: { ...typography.h2, color: colors.text.primary },
  changeBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.sm },
  changeText: { ...typography.captionBold },
  miniChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 40 },
  chartBar: { width: 4, backgroundColor: `${colors.primary}70`, borderRadius: 2 },

  miniCards: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.sm },
  miniCard: { flex: 1, padding: spacing.md, alignItems: 'center' },
  miniCardIcon: { fontSize: 18 },
  miniCardValue: { ...typography.captionBold, color: colors.text.primary, marginTop: spacing.xs, fontSize: 12 },
  miniCardChange: { ...typography.captionBold, fontSize: 11, marginTop: 2 },
  miniCardLabel: { ...typography.caption, color: colors.text.secondary, marginTop: 2, fontSize: 10 },

  oppCardWrapper: { marginBottom: spacing.md },

  statsTitle: { ...typography.h4, color: colors.text.primary, marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { ...typography.h2, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border.primary },
});

export default DashboardScreen;
