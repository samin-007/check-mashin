/**
 * صفحه چک آگهی — بهبود‌یافته با انیمیشن و جزئیات بصری
 * لینک بده → نتیجه بگیر (با افکت reveal خفن)
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Header,
  Card,
  GradientCard,
  SearchBar,
  AnimatedGauge,
  StatusBadge,
  PriceTag,
} from '@components';
import { colors, typography, spacing, borderRadius } from '@theme';

// نتیجه نمونه (Mock)
const MOCK_RESULT = {
  carName: 'پژو ۲۰۷ اتوماتیک',
  year: '۱۴۰۲',
  mileage: '۲۵,۰۰۰ کیلومتر',
  city: 'تهران',
  color: 'سفید',
  price: 1180,
  marketPrice: 1280,
  healthScore: 85,
  verdict: 'opportunity', // opportunity, fair, overpriced, scam
  verdictText: 'فرصت خوبیه، برو ببینش!',
  savingAmount: '۱۰۰ میلیون',
  checks: [
    { label: 'عکس اوریجینال', passed: true, detail: 'عکس‌ها منحصر به این آگهی' },
    { label: 'شماره شخصی', passed: true, detail: 'فقط ۱ آگهی فعال داره' },
    { label: 'قیمت منطقی', passed: true, detail: '۸٪ زیر میانگین بازار' },
    { label: 'متن آگهی معتبر', passed: true, detail: 'کپی نشده' },
    { label: 'تازگی آگهی', passed: true, detail: 'ثبت‌شده ۳ ساعت پیش' },
    { label: 'سابقه فروشنده', passed: false, detail: '۳ آگهی فعال دیگه داره' },
  ],
  priceHistory: {
    oneWeekAgo: 1290,
    twoWeeksAgo: 1310,
    oneMonthAgo: 1250,
  },
};

const CheckScreen = ({ navigation, route }) => {
  const [linkInput, setLinkInput] = useState(route?.params?.link || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showChecks, setShowChecks] = useState(false);

  // انیمیشن‌ها
  const resultFadeAnim = useRef(new Animated.Value(0)).current;
  const resultSlideAnim = useRef(new Animated.Value(50)).current;
  const gaugeAnim = useRef(new Animated.Value(0)).current;
  const checkItemAnims = useRef(
    MOCK_RESULT.checks.map(() => new Animated.Value(0))
  ).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  const handleCheck = () => {
    if (!linkInput.trim()) return;

    setResult(null);
    setLoading(true);
    setShowChecks(false);

    // انیمیشن خط اسکن
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // شبیه‌سازی API call
    setTimeout(() => {
      setResult(MOCK_RESULT);
      setLoading(false);
      scanLineAnim.stopAnimation();
      revealResult();
    }, 2500);
  };

  const revealResult = () => {
    // Reset
    resultFadeAnim.setValue(0);
    resultSlideAnim.setValue(50);
    gaugeAnim.setValue(0);
    checkItemAnims.forEach((a) => a.setValue(0));

    // Reveal sequence
    Animated.sequence([
      // نمایش نتیجه اصلی
      Animated.parallel([
        Animated.timing(resultFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(resultSlideAnim, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),
      // نمایش گیج
      Animated.timing(gaugeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // نمایش چک‌لیست با تأخیر
      setTimeout(() => {
        setShowChecks(true);
        Animated.stagger(
          100,
          checkItemAnims.map((anim) =>
            Animated.spring(anim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          )
        ).start();
      }, 200);
    });
  };

  return (
    <View style={styles.container}>
      <Header title="چک آگهی" subtitle="لینک رو بده، نتیجه رو بگیر" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* حالت اسکن */}
        {loading && (
          <View style={styles.scanningSection}>
            <GradientCard variant="dark">
              <View style={styles.scanContent}>
                <Animated.View style={[
                  styles.scanLine,
                  {
                    opacity: scanLineAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.3, 1, 0.3],
                    }),
                  },
                ]} />
                <Text style={styles.scanTitle}>🔍 در حال بررسی...</Text>
                <Text style={styles.scanSteps}>
                  ✓ دریافت اطلاعات آگهی{'\n'}
                  ● مقایسه قیمت با بازار{'\n'}
                  ○ بررسی سلامت آگهی
                </Text>
              </View>
            </GradientCard>
          </View>
        )}

        {/* نتیجه */}
        {result && !loading && (
          <Animated.View
            style={[
              styles.resultSection,
              {
                opacity: resultFadeAnim,
                transform: [{ translateY: resultSlideAnim }],
              },
            ]}
          >
            {/* کارت نتیجه اصلی */}
            <GradientCard
              variant={result.verdict === 'scam' ? 'danger' : 'primary'}
              glowing
            >
              {/* اطلاعات خودرو */}
              <View style={styles.carInfoRow}>
                <View style={styles.carInfo}>
                  <Text style={styles.carName}>{result.carName}</Text>
                  <Text style={styles.carDetails}>
                    مدل {result.year} • {result.mileage} • {result.city} • {result.color}
                  </Text>
                </View>
              </View>

              {/* گیج امتیاز */}
              <Animated.View style={[styles.gaugeSection, { opacity: gaugeAnim }]}>
                <AnimatedGauge
                  score={result.healthScore}
                  size={130}
                  animated
                />
                <Text style={styles.gaugeCaption}>امتیاز سلامت آگهی</Text>
              </Animated.View>

              {/* حکم نهایی */}
              <View style={styles.verdictSection}>
                <StatusBadge status={result.verdict} size="lg" animated />
                <Text style={styles.verdictText}>{result.verdictText}</Text>
              </View>
            </GradientCard>

            {/* مقایسه قیمت */}
            <Card style={styles.priceSection}>
              <Text style={styles.priceSectionTitle}>💰 مقایسه قیمت</Text>

              <View style={styles.priceCompare}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>قیمت آگهی</Text>
                  <PriceTag price={result.price} size="md" />
                </View>

                <View style={styles.priceArrow}>
                  <Text style={styles.priceArrowIcon}>←</Text>
                </View>

                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>قیمت بازار</Text>
                  <PriceTag price={result.marketPrice} size="md" />
                </View>
              </View>

              {/* بج صرفه‌جویی */}
              <View style={styles.savingBadge}>
                <Text style={styles.savingIcon}>🎉</Text>
                <Text style={styles.savingText}>
                  با خرید این آگهی حدود {result.savingAmount} صرفه‌جویی می‌کنی!
                </Text>
              </View>

              {/* روند قیمت */}
              <View style={styles.historyRow}>
                <Text style={styles.historyTitle}>📈 روند قیمت این مدل:</Text>
                <View style={styles.historyItems}>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>۱ هفته پیش</Text>
                    <Text style={styles.historyValue}>{result.priceHistory.oneWeekAgo} م</Text>
                  </View>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>۲ هفته پیش</Text>
                    <Text style={styles.historyValue}>{result.priceHistory.twoWeeksAgo} م</Text>
                  </View>
                  <View style={styles.historyItem}>
                    <Text style={styles.historyLabel}>۱ ماه پیش</Text>
                    <Text style={styles.historyValue}>{result.priceHistory.oneMonthAgo} م</Text>
                  </View>
                </View>
              </View>
            </Card>

            {/* چک‌لیست سلامت */}
            <Card style={styles.checksSection}>
              <Text style={styles.checksSectionTitle}>🛡️ چک‌لیست سلامت آگهی</Text>
              <Text style={styles.checksSubtitle}>
                {result.checks.filter((c) => c.passed).length}/{result.checks.length} مورد تأیید شده
              </Text>

              {/* نوار پیشرفت */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(result.checks.filter((c) => c.passed).length / result.checks.length) * 100}%`,
                    },
                  ]}
                />
              </View>

              {/* آیتم‌های چک‌لیست */}
              {showChecks &&
                result.checks.map((check, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.checkItem,
                      {
                        opacity: checkItemAnims[index],
                        transform: [
                          {
                            translateX: checkItemAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <View style={[
                      styles.checkIconBox,
                      { backgroundColor: check.passed ? `${colors.status.safe}20` : `${colors.status.danger}20` },
                    ]}>
                      <Text style={[
                        styles.checkIcon,
                        { color: check.passed ? colors.status.safe : colors.status.danger },
                      ]}>
                        {check.passed ? '✓' : '✗'}
                      </Text>
                    </View>
                    <View style={styles.checkContent}>
                      <Text style={[
                        styles.checkLabel,
                        { color: check.passed ? colors.text.primary : colors.status.danger },
                      ]}>
                        {check.label}
                      </Text>
                      <Text style={styles.checkDetail}>{check.detail}</Text>
                    </View>
                  </Animated.View>
                ))}
            </Card>

            {/* دکمه‌های اقدام */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionLabel}>اشتراک</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>🔔</Text>
                <Text style={styles.actionLabel}>ساخت رادار</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionIcon}>🔗</Text>
                <Text style={styles.actionLabel}>باز کردن آگهی</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* راهنما — وقتی نتیجه‌ای نیست */}
        {!result && !loading && (
          <View style={styles.helpSection}>
            <GradientCard variant="dark">
              <Text style={styles.helpTitle}>🚀 چطوری کار می‌کنه؟</Text>
              
              <View style={styles.helpSteps}>
                <View style={styles.helpStep}>
                  <View style={styles.helpStepNumber}>
                    <Text style={styles.helpStepNumberText}>۱</Text>
                  </View>
                  <View style={styles.helpStepContent}>
                    <Text style={styles.helpStepTitle}>کپی کن</Text>
                    <Text style={styles.helpStepText}>لینک آگهی دیوار یا باما رو کپی کن</Text>
                  </View>
                </View>

                <View style={styles.helpConnector} />

                <View style={styles.helpStep}>
                  <View style={styles.helpStepNumber}>
                    <Text style={styles.helpStepNumberText}>۲</Text>
                  </View>
                  <View style={styles.helpStepContent}>
                    <Text style={styles.helpStepTitle}>بچسبون</Text>
                    <Text style={styles.helpStepText}>تو باکس بالا paste کن و چک کن رو بزن</Text>
                  </View>
                </View>

                <View style={styles.helpConnector} />

                <View style={styles.helpStep}>
                  <View style={styles.helpStepNumber}>
                    <Text style={styles.helpStepNumberText}>۳</Text>
                  </View>
                  <View style={styles.helpStepContent}>
                    <Text style={styles.helpStepTitle}>تصمیم بگیر</Text>
                    <Text style={styles.helpStepText}>ما ۳ ثانیه‌ای بهت می‌گیم: بخر، صبر کن، یا فرار کن!</Text>
                  </View>
                </View>
              </View>
            </GradientCard>

            {/* نمونه */}
            <Card style={styles.exampleCard}>
              <Text style={styles.exampleTitle}>💡 لینک نمونه</Text>
              <TouchableOpacity
                style={styles.exampleLink}
                onPress={() => setLinkInput('https://divar.ir/v/example-207')}
              >
                <Text style={styles.exampleLinkText}>
                  https://divar.ir/v/peugeot-207-auto-1402...
                </Text>
                <Text style={styles.exampleCopy}>کپی</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}
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

  // ورودی
  inputSection: {
    padding: spacing.lg,
  },

  // اسکن
  scanningSection: {
    paddingHorizontal: spacing.lg,
  },
  scanContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  scanTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  scanSteps: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'right',
    lineHeight: 28,
  },

  // نتیجه
  resultSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  // اطلاعات خودرو
  carInfoRow: {
    marginBottom: spacing.lg,
  },
  carInfo: {},
  carName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  carDetails: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },

  // گیج
  gaugeSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  gaugeCaption: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },

  // حکم
  verdictSection: {
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  verdictText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // قیمت
  priceSection: {
    padding: spacing.xl,
  },
  priceSectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  priceCompare: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  priceArrow: {
    paddingHorizontal: spacing.md,
  },
  priceArrowIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  savingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.status.safe}10`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.status.safe}30`,
  },
  savingIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  savingText: {
    ...typography.bodyBold,
    color: colors.status.safe,
    flex: 1,
  },

  // روند قیمت
  historyRow: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
  },
  historyTitle: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  historyItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItem: {
    alignItems: 'center',
  },
  historyLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  historyValue: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },

  // چک‌لیست
  checksSection: {
    padding: spacing.xl,
  },
  checksSectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
  },
  checksSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.elevated,
    borderRadius: 2,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.secondary,
  },
  checkIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  checkContent: {
    flex: 1,
  },
  checkLabel: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  checkDetail: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },

  // اقدامات
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
  },
  actionBtn: {
    alignItems: 'center',
    padding: spacing.md,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // راهنما
  helpSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  helpTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  helpSteps: {},
  helpStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpStepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  helpStepNumberText: {
    ...typography.bodyBold,
    color: colors.text.inverse,
  },
  helpStepContent: {
    flex: 1,
  },
  helpStepTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  helpStepText: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: 2,
  },
  helpConnector: {
    width: 2,
    height: 20,
    backgroundColor: colors.border.primary,
    marginLeft: 17,
    marginVertical: spacing.sm,
  },

  // نمونه
  exampleCard: {
    padding: spacing.lg,
  },
  exampleTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  exampleLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  exampleLinkText: {
    ...typography.caption,
    color: colors.accent,
    flex: 1,
  },
  exampleCopy: {
    ...typography.captionBold,
    color: colors.primary,
  },
});

export default CheckScreen;
