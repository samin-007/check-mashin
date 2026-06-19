/**
 * چک‌ماشین — سیستم تایپوگرافی (Vazirmatn)
 */

const fontFamily = 'Vazirmatn';
const fontFamilyBold = 'Vazirmatn-Bold';

export const typography = {
  // عناوین
  h1: {
    fontFamily: fontFamilyBold,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamilyBold,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamilyBold,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
  },
  h4: {
    fontFamily: fontFamilyBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
  },

  // متن بدنه
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
  },
  bodyBold: {
    fontFamily: fontFamilyBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 26,
  },
  bodySmall: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },

  // کپشن و جزئیات
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  captionBold: {
    fontFamily: fontFamilyBold,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },

  // اعداد و قیمت
  price: {
    fontFamily: fontFamilyBold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  priceSmall: {
    fontFamily: fontFamilyBold,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  number: {
    fontFamily: fontFamilyBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.5,
  },

  // دکمه‌ها
  button: {
    fontFamily: fontFamilyBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily: fontFamilyBold,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  // لیبل
  label: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
};

export default typography;
