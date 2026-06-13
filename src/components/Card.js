/**
 * کارت — کامپوننت مشترک
 * برای نمایش آگهی‌ها، فرصت‌ها و نتایج
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadow } from '@theme';

const Card = ({
  children,
  onPress,
  variant = 'default', // default, highlighted, danger, success
  style,
  padded = true,
}) => {
  const cardStyles = [
    styles.base,
    padded && styles.padded,
    styles[variant],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...shadow.md,
  },
  padded: {
    padding: spacing.lg,
  },

  // Variants
  default: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.primary,
  },
  highlighted: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  danger: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.secondary,
    borderWidth: 1.5,
  },
  success: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
});

export default Card;
