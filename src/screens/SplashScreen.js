/**
 * صفحه Splash — خوش‌آمدگویی (Expo Compatible)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.5)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(ringScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(ringOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.spring(logoScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(titleSlide, { toValue: 0, tension: 80, friction: 10, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(fadeOut, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      if (onFinish) onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* لوگو */}
      <View style={styles.logoSection}>
        <Animated.View style={[styles.outerRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🚗</Text>
          </View>
        </Animated.View>
      </View>

      {/* عنوان */}
      <Animated.View style={[styles.titleSection, { opacity: titleOpacity, transform: [{ translateY: titleSlide }] }]}>
        <Text style={styles.title}>چک‌ماشین</Text>
        <Text style={styles.titleEnglish}>Check Mashin</Text>
      </Animated.View>

      {/* زیرعنوان */}
      <Animated.View style={[styles.subtitleSection, { opacity: subtitleOpacity }]}>
        <Text style={styles.subtitle}>رادار فرصت خرید خودرو</Text>
        <Text style={styles.tagline}>بخر • صبر کن • فرار کن</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary, alignItems: 'center', justifyContent: 'center' },
  logoSection: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  outerRing: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderColor: `${colors.primary}30` },
  logoContainer: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 80, height: 80, borderRadius: 24, backgroundColor: colors.background.secondary, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 36 },
  titleSection: { alignItems: 'center', marginTop: spacing.xxxl },
  title: { ...typography.h1, color: colors.text.primary, fontSize: 36 },
  titleEnglish: { ...typography.label, color: colors.text.tertiary, marginTop: spacing.xs, letterSpacing: 2 },
  subtitleSection: { alignItems: 'center', marginTop: spacing.xl },
  subtitle: { ...typography.body, color: colors.text.secondary },
  tagline: { ...typography.bodyBold, color: colors.primary, marginTop: spacing.sm, letterSpacing: 1 },
});

export default SplashScreen;
