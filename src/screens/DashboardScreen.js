/**
 * صفحه اصلی — داشبورد چک‌ماشین (Expo Compatible)
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
  Dimensions,
} from 'react-native';
import { Card, OpportunityCard, GradientCard, SearchBar, MarketTicker } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// داده‌های نمونه
const MOCK_MARKET = {
  indexValue: '۱۲,۴۵۰',
  indexChange: +2.1,
  topGainer: { name: 'کوییک R', change: +4.8 },
  topLoser: { name: 'پراید ۱۱۱', change: -2.3 },
  totalAds: '۱,۲۴۰',
  opportunities: '۲۳',
  scams: '۵',
};

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
];

const DashboardScreen = ({ navigation }) => {
  const [linkInput, setLinkInput] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);

  // انیمیشن‌ها
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(
    MOCK_OPPORTUNITIES.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(
      150,
      cardAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const handleCheckLink = () => {
    if (!linkInput.trim()) return;
    setCheckLoading(true);
    setTimeout(() => {
      setCheckLoading(false);
      navigation?.navigate('چک آگهی', { link: linkInput });
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* هدر */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>CM</Text>
        </View>
        <View>
          <Text style={styles.headerTitle}>چک‌ماشین</Text>
          <Text style={styles.headerSubtitle}>رادار فرصت خرید خودرو</Text>
        </View>
      </View>

      {/* تیکر بازار */}
      <MarketTicker />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <GradientCard variant="primary" glowing>
            <View style={styles.heroContent}>
              <Text style={styles.heroEmoji}>🔍</Text>
              <Text style={styles.heroTitle}>آگهی رو چک کن</Text>
              <Text style={styles.heroSubtitle}>
                لینک آگهی دیوار یا باما رو بده{'\n'}
                ۳ ثانیه‌ای بهت می‌گیم: بخر یا فرار کن!
              </Text>
            </View>
            <SearchBar
              value={linkInput}
              onChangeText={setLinkInput}
              onSubmit={handleCheckLink}
              loading={checkLoading}
              placeholder="لینک آگهی رو بچسبون..."
            />
          </GradientCard>
        </Animated.View>

        {/* شاخص بازار */}
        <Animated.View style={[styles.marketSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 وضعیت بازار</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('بازار')}>
              <Text style={styles.seeAll}>بیشتر →</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.indexCard}>
            <View style={styles.indexRow}>
              <View>
                <Text style={styles.indexLabel}>شاخص کل خودرو</Text>
                <View style={styles.indexValueRow}>
                  <Text style={styles.indexValue}>{MOCK_MARKET.indexValue}</Text>
                  <View style={[styles.changeBadge, { backgroundColor: `${colors.status.safe}20` }]}>
                    <Text style={[styles.changeText, { color: colors.status.safe }]}>
                      ▲ +{MOCK_MARKET.indexChange}٪
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

          <View style={styles.miniCards}>
            <Card style={styles.miniCard}>
              <Text style={styles.miniCardIcon}>📈</Text>
              <Text style={styles.miniCardValue}>{MOCK_MARKET.topGainer.name}</Text>
              <Text style={[styles.miniCardChange, { color: colors.status.safe }]}>+{MOCK_MARKET.topGainer.change}٪</Text>
            </Card>
            <Card style={styles.miniCard}>
              <Text style={styles.miniCardIcon}>📉</Text>
              <Text style={styles.miniCardValue}>{MOCK_MARKET.topLoser.name}</Text>
              <Text style={[styles.miniCardChange, { color: colors.status.danger }]}>{MOCK_MARKET.topLoser.change}٪</Text>
            </Card>
            <Card style={styles.miniCard}>
              <Text style={styles.miniCardIcon}>🔥</Text>
              <Text style={styles.miniCardValue}>{MOCK_MARKET.opportunities}</Text>
              <Text style={styles.miniCardLabel}>فرصت</Text>
            </Card>
          </View>
        </Animated.View>

        {/* فرصت‌ها */}
        <View style={styles.opportunitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 فرصت‌های داغ امروز</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('فرصت‌ها')}>
              <Text style={styles.seeAll}>همه →</Text>
            </TouchableOpacity>
          </View>

          {MOCK_OPPORTUNITIES.map((opp, index) => (
            <Animated.View
              key={opp.id}
              style={[
                styles.oppCardWrapper,
                {
                  opacity: cardAnims[index],
                  transform: [{
                    translateY: cardAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  }],
                },
              ]}
            >
              <OpportunityCard
                opportunity={opp}
                onPress={() => navigation?.navigate('چک آگهی')}
              />
            </Animated.View>
          ))}
        </View>

        {/* آمار */}
        <View style={styles.statsSection}>
          <GradientCard variant="dark">
            <Text style={styles.statsTitle}>📋 عملکرد امروز</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{MOCK_MARKET.totalAds}</Text>
                <Text style={styles.statLabel}>آگهی رصدشده</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.status.safe }]}>{MOCK_MARKET.opportunities}</Text>
                <Text style={styles.statLabel}>فرصت</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.status.danger }]}>{MOCK_MARKET.scams}</Text>
                <Text style={styles.statLabel}>مشکوک</Text>
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

  marketSection: { paddingHorizontal: spacing.lg, marginTop: spacing.sm },
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

  opportunitiesSection: { paddingHorizontal: spacing.lg, marginTop: spacing.xxl },
  oppCardWrapper: { marginBottom: spacing.md },

  statsSection: { paddingHorizontal: spacing.lg, marginTop: spacing.xxl },
  statsTitle: { ...typography.h4, color: colors.text.primary, marginBottom: spacing.lg },
  statsGrid: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { ...typography.h2, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border.primary },
});

export default DashboardScreen;
