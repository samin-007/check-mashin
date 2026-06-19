/**
 * صفحه چک آگهی — وصل به API واقعی
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  GradientCard,
  SearchBar,
  AnimatedGauge,
  StatusBadge,
  PriceTag,
} from '../components';
import { useCheckAd } from '../hooks';
import { colors, typography, spacing, borderRadius } from '../theme';

const CheckScreen = ({ navigation, route }) => {
  const [linkInput, setLinkInput] = useState(route?.params?.link || '');
  const { result, loading, error, checkAd, reset } = useCheckAd();

  // انیمیشن‌ها
  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultSlideAnim = useRef(new Animated.Value(50)).current;

  const handleCheck = async () => {
    if (!linkInput.trim()) return;
    
    resultFadeAnim.setValue(0);
    resultSlideAnim.setValue(50);
    
    const data = await checkAd(linkInput);
    
    if (data) {
      Animated.parallel([
        Animated.timing(resultFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(resultSlideAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* هدر */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>چک آگهی</Text>
        <Text style={styles.headerSubtitle}>لینک رو بده، نتیجه رو بگیر</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ورودی لینک */}
        <View style={styles.inputSection}>
          <SearchBar
            value={linkInput}
            onChangeText={setLinkInput}
            onSubmit={handleCheck}
            loading={loading}
            placeholder="لینک آگهی دیوار یا باما..."
            buttonText="چک کن"
            icon="🔗"
          />
        </View>

        {/* خطا */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* حالت لودینگ */}
        {loading && (
          <View style={styles.loadingSection}>
            <GradientCard variant="dark">
              <View style={styles.loadingContent}>
                <Text style={styles.loadingTitle}>🔍 در حال بررسی...</Text>
                <Text style={styles.loadingSteps}>
                  ● دریافت اطلاعات آگهی{'\n'}
                  ● مقایسه قیمت با بازار{'\n'}
                  ○ بررسی سلامت آگهی
                </Text>
              </View>
            </GradientCard>
          </View>
        )}

        {/* نتیجه */}
        {result && !loading && (
          <Animated.View style={[styles.resultSection, { opacity: resultFadeAnim, transform: [{ translateY: resultSlideAnim }] }]}>
            
            {/* کارت نتیجه اصلی */}
            <GradientCard variant={result.verdict === 'scam' ? 'danger' : 'primary'} glowing>
              <View style={styles.carInfoRow}>
                <Text style={styles.carName}>{result.car_name}</Text>
                <Text style={styles.carDetails}>
                  مدل {result.year} • {result.mileage || ''} • {result.city || ''}
                </Text>
              </View>

              {/* گیج امتیاز */}
              <View style={styles.gaugeSection}>
                <AnimatedGauge score={result.health_score} size={130} animated />
                <Text style={styles.gaugeCaption}>امتیاز سلامت آگهی</Text>
              </View>

              {/* حکم نهایی */}
              <View style={styles.verdictSection}>
                <StatusBadge status={result.verdict} size="lg" animated />
                <Text style={styles.verdictText}>{result.verdict_text}</Text>
              </View>
            </GradientCard>

            {/* مقایسه قیمت */}
            <Card style={styles.priceCard}>
              <Text style={styles.cardTitle}>💰 مقایسه قیمت</Text>
              <View style={styles.priceCompare}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>قیمت آگهی</Text>
                  <PriceTag price={result.price_comparison.ad_price} size="md" />
                </View>
                <Text style={styles.priceArrow}>←</Text>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>قیمت بازار</Text>
                  <PriceTag price={result.price_comparison.market_price} size="md" />
                </View>
              </View>

              {result.saving_amount && (
                <View style={styles.savingBadge}>
                  <Text style={styles.savingText}>🎉 صرفه‌جویی: {result.saving_amount} تومان</Text>
                </View>
              )}

              {result.price_comparison.ad_price === result.price_comparison.market_price && (
                <View style={[styles.savingBadge, { borderColor: `${colors.status.info}30`, backgroundColor: `${colors.status.info}10` }]}>
                  <Text style={[styles.savingText, { color: colors.status.info }]}>ℹ️ قیمت بازار برای این مدل در دیتابیس ما موجود نیست</Text>
                </View>
              )}
            </Card>

            {/* چک‌لیست سلامت */}
            <Card style={styles.checksCard}>
              <Text style={styles.cardTitle}>🛡️ چک‌لیست سلامت</Text>
              <Text style={styles.checksSubtitle}>
                {result.health_checks.filter(c => c.passed).length}/{result.health_checks.length} مورد تأیید
              </Text>

              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(result.health_checks.filter(c => c.passed).length / result.health_checks.length) * 100}%` }]} />
              </View>

              {result.health_checks.map((check, index) => (
                <View key={index} style={styles.checkItem}>
                  <View style={[styles.checkIconBox, { backgroundColor: check.passed ? `${colors.status.safe}20` : `${colors.status.danger}20` }]}>
                    <Text style={[styles.checkIcon, { color: check.passed ? colors.status.safe : colors.status.danger }]}>
                      {check.passed ? '✓' : '✗'}
                    </Text>
                  </View>
                  <View style={styles.checkContent}>
                    <Text style={[styles.checkLabel, { color: check.passed ? colors.text.primary : colors.status.danger }]}>{check.label}</Text>
                    {check.detail && <Text style={styles.checkDetail}>{check.detail}</Text>}
                  </View>
                </View>
              ))}
            </Card>
          </Animated.View>
        )}

        {/* راهنما */}
        {!result && !loading && !error && (
          <View style={styles.helpSection}>
            <GradientCard variant="dark">
              <Text style={styles.helpTitle}>🚀 چطوری کار می‌کنه؟</Text>
              <View style={styles.helpStep}>
                <View style={styles.helpNum}><Text style={styles.helpNumText}>۱</Text></View>
                <Text style={styles.helpText}>لینک آگهی دیوار یا باما رو کپی کن</Text>
              </View>
              <View style={styles.helpStep}>
                <View style={styles.helpNum}><Text style={styles.helpNumText}>۲</Text></View>
                <Text style={styles.helpText}>اینجا paste کن و "چک کن" رو بزن</Text>
              </View>
              <View style={styles.helpStep}>
                <View style={styles.helpNum}><Text style={styles.helpNumText}>۳</Text></View>
                <Text style={styles.helpText}>ما ۳ ثانیه‌ای بهت می‌گیم: بخر یا فرار کن!</Text>
              </View>
            </GradientCard>

            <Card style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>💡 لینک نمونه برای تست:</Text>
              <TouchableOpacity style={styles.exampleLink} onPress={() => setLinkInput('https://divar.ir/v/peugeot-207-1402')}>
                <Text style={styles.exampleLinkText}>https://divar.ir/v/peugeot-207-1402</Text>
                <Text style={styles.exampleCopy}>استفاده</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}
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

  inputSection: { padding: spacing.lg },

  errorBox: { marginHorizontal: spacing.lg, padding: spacing.md, backgroundColor: `${colors.status.danger}15`, borderRadius: borderRadius.md, borderWidth: 1, borderColor: `${colors.status.danger}30` },
  errorText: { ...typography.bodySmall, color: colors.status.danger, textAlign: 'center' },

  loadingSection: { paddingHorizontal: spacing.lg },
  loadingContent: { alignItems: 'center', paddingVertical: spacing.xl },
  loadingTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.lg },
  loadingSteps: { ...typography.body, color: colors.text.secondary, textAlign: 'right', lineHeight: 28 },

  resultSection: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  carInfoRow: { marginBottom: spacing.md },
  carName: { ...typography.h2, color: colors.text.primary },
  carDetails: { ...typography.bodySmall, color: colors.text.secondary, marginTop: spacing.xs },
  gaugeSection: { alignItems: 'center', marginVertical: spacing.lg },
  gaugeCaption: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.md },
  verdictSection: { alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  verdictText: { ...typography.body, color: colors.text.secondary, textAlign: 'center' },

  priceCard: { padding: spacing.xl },
  cardTitle: { ...typography.h4, color: colors.text.primary, marginBottom: spacing.lg },
  priceCompare: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceBox: { flex: 1, alignItems: 'center' },
  priceLabel: { ...typography.caption, color: colors.text.secondary, marginBottom: spacing.sm },
  priceArrow: { fontSize: 24, color: colors.primary, paddingHorizontal: spacing.md },
  savingBadge: { backgroundColor: `${colors.status.safe}10`, borderRadius: borderRadius.md, padding: spacing.md, marginTop: spacing.lg, borderWidth: 1, borderColor: `${colors.status.safe}30` },
  savingText: { ...typography.bodyBold, color: colors.status.safe, textAlign: 'center' },

  checksCard: { padding: spacing.xl },
  checksSubtitle: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xs },
  progressBar: { height: 4, backgroundColor: colors.background.elevated, borderRadius: 2, marginTop: spacing.md, marginBottom: spacing.lg, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.secondary },
  checkIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  checkIcon: { fontSize: 16, fontWeight: '700' },
  checkContent: { flex: 1 },
  checkLabel: { ...typography.bodyBold, fontSize: 14 },
  checkDetail: { ...typography.caption, color: colors.text.tertiary, marginTop: 2 },

  helpSection: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  helpTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.xl },
  helpStep: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  helpNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  helpNumText: { ...typography.bodyBold, color: colors.text.inverse },
  helpText: { ...typography.body, color: colors.text.secondary, flex: 1 },

  exampleCard: { padding: spacing.lg },
  exampleTitle: { ...typography.bodyBold, color: colors.text.primary, marginBottom: spacing.md },
  exampleLink: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background.tertiary, padding: spacing.md, borderRadius: borderRadius.md },
  exampleLinkText: { ...typography.caption, color: colors.accent, flex: 1 },
  exampleCopy: { ...typography.captionBold, color: colors.primary },
});

export default CheckScreen;
