/**
 * GradientCard — کارت با گرادیانت و افکت‌های خاص
 * برای بخش‌های ویژه مثل CTA، نتیجه چک، و فرصت‌های طلایی
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadow } from '@theme';

const GradientCard = ({
  children,
  onPress,
  variant = 'primary', // primary, danger, premium, dark
  glowing = false,
  style,
}) => {
  // شبیه‌سازی گرادیانت با لایه‌ها (بدون نیاز به react-native-linear-gradient)
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.background.secondary, accent: colors.primary, border: colors.primary };
      case 'danger':
        return { bg: colors.background.secondary, accent: colors.secondary, border: colors.secondary };
      case 'premium':
        return { bg: '#1A1500', accent: colors.warning, border: colors.warning };
      case 'dark':
        return { bg: colors.background.tertiary, accent: colors.accent, border: colors.accent };
      default:
        return { bg: colors.background.secondary, accent: colors.primary, border: colors.primary };
    }
  };

  const gradColors = getGradientColors();

  const cardStyles = [
    styles.base,
    {
      backgroundColor: gradColors.bg,
      borderColor: `${gradColors.border}40`,
    },
    glowing && {
      shadowColor: gradColors.accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    style,
  ];

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={cardStyles} onPress={onPress} activeOpacity={0.85}>
      {/* خط بالایی رنگی */}
      <View style={[styles.topAccent, { backgroundColor: gradColors.accent }]} />
      
      {/* محتوا */}
      <View style={styles.content}>
        {children}
      </View>

      {/* افکت نوری گوشه */}
      <View style={[styles.cornerGlow, { backgroundColor: `${gradColors.accent}08` }]} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  topAccent: {
    height: 3,
    width: '100%',
    opacity: 0.8,
  },
  content: {
    padding: spacing.xl,
  },
  cornerGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderBottomLeftRadius: 100,
    opacity: 0.5,
  },
});

export default GradientCard;
