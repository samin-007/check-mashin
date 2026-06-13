/**
 * صفحه Splash — خوش‌آمدگویی با انیمیشن خودرویی
 * لوگو + تگ‌لاین + انیمیشن سرعت‌سنج
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  // انیمیشن‌ها
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.5)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.5)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const needleRotate = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const particleAnims = useRef(
    Array.from({ length: 8 }, () => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      // فاز ۱: نمایش حلقه‌ها
      Animated.parallel([
        Animated.spring(ringScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // فاز ۲: لوگو ظاهر می‌شه
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(ring2Scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(ring2Opacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      // فاز ۳: عقربه سرعت‌سنج
      Animated.timing(needleRotate, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // فاز ۴: ذرات نور
      Animated.parallel(
        particleAnims.map((p, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(p.scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateX, {
              toValue: Math.cos(angle) * 80,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(p.translateY, {
              toValue: Math.sin(angle) * 80,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]);
        })
      ),

      // فاز ۵: عنوان
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
        }),
      ]),

      // فاز ۶: زیرعنوان
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // وقفه
      Animated.delay(800),

      // فاز ۷: خروج
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]);

    sequence.start(() => {
      if (onFinish) onFinish();
    });
  }, []);

  const needleRotation = needleRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '45deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />

      {/* پس‌زمینه */}
      <View style={styles.background}>
        {/* خطوط تزئینی */}
        <View style={styles.gridLine1} />
        <View style={styles.gridLine2} />
        <View style={styles.gridLine3} />
      </View>

      {/* لوگو مرکزی */}
      <View style={styles.logoSection}>
        {/* حلقه بیرونی */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              transform: [{ scale: ringScale }],
              opacity: ringOpacity,
            },
          ]}
        />

        {/* حلقه دوم */}
        <Animated.View
          style={[
            styles.innerRing,
            {
              transform: [{ scale: ring2Scale }],
              opacity: ring2Opacity,
            },
          ]}
        />

        {/* ذرات نور */}
        {particleAnims.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                opacity: p.opacity,
                transform: [
                  { translateX: p.translateX },
                  { translateY: p.translateY },
                  { scale: p.scale },
                ],
              },
            ]}
          />
        ))}

        {/* لوگو */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🚗</Text>
            {/* عقربه سرعت‌سنج */}
            <Animated.View
              style={[
                styles.needle,
                {
                  transform: [{ rotate: needleRotation }],
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      {/* عنوان */}
      <Animated.View
        style={[
          styles.titleSection,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleSlide }],
          },
        ]}
      >
        <Text style={styles.title}>چک‌ماشین</Text>
        <Text style={styles.titleEnglish}>Check Mashin</Text>
      </Animated.View>

      {/* زیرعنوان */}
      <Animated.View style={[styles.subtitleSection, { opacity: subtitleOpacity }]}>
        <Text style={styles.subtitle}>
          رادار فرصت خرید خودرو
        </Text>
        <Text style={styles.tagline}>
          بخر • صبر کن • فرار کن
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // پس‌زمینه
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridLine1: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
    height: 1,
    backgroundColor: `${colors.primary}08`,
    top: '30%',
    transform: [{ rotate: '-15deg' }],
  },
  gridLine2: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
    height: 1,
    backgroundColor: `${colors.primary}06`,
    top: '50%',
    transform: [{ rotate: '10deg' }],
  },
  gridLine3: {
    position: 'absolute',
    width: SCREEN_WIDTH * 2,
    height: 1,
    backgroundColor: `${colors.primary}04`,
    top: '70%',
    transform: [{ rotate: '-5deg' }],
  },

  // لوگو
  logoSection: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: `${colors.primary}30`,
  },
  innerRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoIcon: {
    fontSize: 36,
  },
  needle: {
    position: 'absolute',
    bottom: '50%',
    width: 2,
    height: 25,
    backgroundColor: colors.primary,
    borderRadius: 1,
    transformOrigin: 'bottom',
  },

  // عنوان
  titleSection: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    fontSize: 36,
  },
  titleEnglish: {
    ...typography.label,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
    letterSpacing: 2,
  },

  // زیرعنوان
  subtitleSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  tagline: {
    ...typography.bodyBold,
    color: colors.primary,
    marginTop: spacing.sm,
    letterSpacing: 1,
  },
});

export default SplashScreen;
