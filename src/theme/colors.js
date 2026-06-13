/**
 * چک‌ماشین — سیستم رنگ‌ها
 * تم خودرویی: تیره، متالیک، اسپرت
 */

export const colors = {
  // رنگ‌های اصلی
  primary: '#00E676',        // سبز نئون — فرصت، موفقیت
  primaryDark: '#00C853',
  primaryLight: '#69F0AE',

  secondary: '#FF5252',      // قرمز — هشدار، خطر
  secondaryDark: '#D32F2F',
  secondaryLight: '#FF8A80',

  accent: '#448AFF',         // آبی — اطلاعات، لینک
  accentDark: '#2962FF',
  accentLight: '#82B1FF',

  warning: '#FFD740',        // زرد — احتیاط
  warningDark: '#FFC400',

  // رنگ‌های پس‌زمینه (تم تاریک)
  background: {
    primary: '#0D1117',      // پس‌زمینه اصلی — مثل داشبورد ماشین
    secondary: '#161B22',    // کارت‌ها
    tertiary: '#1C2128',     // المان‌های جزئی
    elevated: '#21262D',     // المان‌های بالاتر
  },

  // رنگ‌های متن
  text: {
    primary: '#F0F6FC',      // متن اصلی — سفید
    secondary: '#8B949E',    // متن ثانویه — خاکستری
    tertiary: '#6E7681',     // متن کم‌رنگ
    inverse: '#0D1117',      // متن روی پس‌زمینه روشن
  },

  // رنگ‌های مرز و خطوط
  border: {
    primary: '#30363D',
    secondary: '#21262D',
    accent: '#00E676',
  },

  // گرادیانت‌ها
  gradient: {
    primary: ['#00E676', '#00C853'],
    dark: ['#161B22', '#0D1117'],
    card: ['#1C2128', '#161B22'],
    danger: ['#FF5252', '#D32F2F'],
    premium: ['#FFD740', '#FF6D00'],
  },

  // رنگ‌های وضعیت
  status: {
    safe: '#00E676',         // آگهی سالم
    warning: '#FFD740',      // احتیاط
    danger: '#FF5252',       // کلاهبرداری
    info: '#448AFF',         // اطلاعات
    neutral: '#8B949E',      // خنثی
  },

  // رنگ‌های خودرویی
  car: {
    speedometer: '#00E676',  // مثل سرعت‌سنج
    rpm: '#FF5252',          // مثل دورسنج
    fuel: '#FFD740',         // مثل بنزین
    metallic: '#B0BEC5',     // متالیک
    carbon: '#37474F',       // کربن
    chrome: '#CFD8DC',       // کروم
  },
};

export default colors;
