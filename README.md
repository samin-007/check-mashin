# چک‌ماشین 🚗
 
> رادار فرصت خرید + تشخیص کلاهبرداری خودرو

لینک آگهی رو بده، ۳ ثانیه‌ای بهت می‌گیم: **بخر، صبر کن، یا فرار کن.**

---

## ✨ قابلیت‌ها

- 🔍 **چک آگهی** — لینک دیوار/باما بده → امتیاز سلامت + مقایسه قیمت
- 🔥 **رادار فرصت** — آگهی‌های زیر قیمت بازار رو پیدا می‌کنیم
- 🔔 **هشدار هوشمند** — وقتی فرصت مطابق شرایطت اومد، خبرت می‌دیم
- 📊 **بازار** — شاخص بازار + قیمت روز + مقایسه با دلار/طلا

---

## 🛠️ تکنولوژی

| بخش | تکنولوژی |
|------|----------|
| 📱 اپ موبایل | React Native |
| ⚙️ بک‌اند | Python (FastAPI) |
| 🗄️ دیتابیس | PostgreSQL |
| 🔔 نوتیفیکیشن | Firebase Cloud Messaging |

---

## 📁 ساختار پروژه

```
check-mashin/
├── App.js                    # Entry point
├── src/
│   ├── components/           # کامپوننت‌های مشترک
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Header.js
│   │   ├── ScoreIndicator.js
│   │   ├── PriceTag.js
│   │   └── OpportunityCard.js
│   ├── screens/              # صفحات
│   │   ├── DashboardScreen.js
│   │   ├── CheckScreen.js
│   │   ├── OpportunitiesScreen.js
│   │   ├── AlertsScreen.js
│   │   └── MarketScreen.js
│   ├── navigation/           # مسیریابی
│   │   └── AppNavigator.js
│   ├── theme/                # سیستم طراحی
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── spacing.js
│   ├── services/             # API calls
│   ├── hooks/                # Custom hooks
│   ├── utils/                # ابزارها
│   └── assets/               # فایل‌های استاتیک
└── package.json
```

---

## 🚀 شروع

```bash
# نصب وابستگی‌ها
npm install

# اجرا روی اندروید
npx react-native run-android

# اجرا روی iOS
npx react-native run-ios
```

---

## 🎨 تم طراحی

- **تم اصلی:** تیره (Dark)
- **رنگ اصلی:** سبز نئون `#00E676` (مثل سرعت‌سنج)
- **رنگ هشدار:** قرمز `#FF5252`
- **حس کلی:** داشبورد ماشین، متالیک، اسپرت