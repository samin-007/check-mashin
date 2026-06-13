/**
 * صفحه هشدارها — رادارهای فعال + تاریخچه
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Header, Card, Button } from '@components';
import { colors, typography, spacing, borderRadius } from '@theme';

// داده‌های نمونه
const MOCK_RADARS = [
  {
    id: '1',
    carName: 'پژو ۲۰۷ اتوماتیک',
    year: '۱۴۰۲',
    maxPrice: '۱,۲۰۰ میلیون',
    city: 'تهران',
    active: true,
    hits: 3,
  },
  {
    id: '2',
    carName: 'دنا پلاس',
    year: '۱۴۰۲-۱۴۰۳',
    maxPrice: '۱,۳۰۰ میلیون',
    city: 'همه شهرها',
    active: true,
    hits: 1,
  },
  {
    id: '3',
    carName: 'تارا اتوماتیک',
    year: '۱۴۰۳',
    maxPrice: '۱,۵۰۰ میلیون',
    city: 'تهران',
    active: false,
    hits: 0,
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'opportunity',
    title: '🔥 فرصت جدید!',
    message: 'پژو ۲۰۷ اتوماتیک ۱۴۰۲ — ۱,۱۸۰ میلیون (۸٪ زیر بازار)',
    time: '۲ ساعت پیش',
  },
  {
    id: '2',
    type: 'price_drop',
    title: '📉 ریزش قیمت',
    message: 'قیمت دنا پلاس ۳٪ کاهش یافت — الان ۱,۲۵۰ میلیون',
    time: '۵ ساعت پیش',
  },
  {
    id: '3',
    type: 'market',
    title: '📊 خلاصه بازار',
    message: 'بازار امروز ۲.۱٪ مثبت بود. بیشترین رشد: کوییک R (+۴.۸٪)',
    time: 'دیروز',
  },
  {
    id: '4',
    type: 'opportunity',
    title: '🔥 فرصت جدید!',
    message: 'تارا اتوماتیک ۱۴۰۳ — ۱,۴۲۰ میلیون (۷٪ زیر بازار)',
    time: 'دیروز',
  },
];

const AlertsScreen = ({ navigation }) => {
  const [radars, setRadars] = useState(MOCK_RADARS);

  const toggleRadar = (id) => {
    setRadars(radars.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
  };

  const getNotifColor = (type) => {
    switch (type) {
      case 'opportunity': return colors.status.safe;
      case 'price_drop': return colors.accent;
      case 'market': return colors.status.info;
      default: return colors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="هشدارها"
        subtitle="رادارهای فعال و اعلان‌ها"
        rightComponent={
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ رادار جدید</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* رادارهای فعال */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📡 رادارهای من</Text>
          <Text style={styles.sectionSubtitle}>
            وقتی آگهی مطابق شرایطت اومد، بهت خبر می‌دیم
          </Text>

          {radars.map((radar) => (
            <Card key={radar.id} style={styles.radarCard}>
              <View style={styles.radarHeader}>
                <View style={styles.radarInfo}>
                  <Text style={styles.radarName}>{radar.carName}</Text>
                  <Text style={styles.radarDetails}>
                    مدل {radar.year} • {radar.city} • حداکثر {radar.maxPrice}
                  </Text>
                </View>
                <Switch
                  value={radar.active}
                  onValueChange={() => toggleRadar(radar.id)}
                  trackColor={{ false: colors.background.elevated, true: `${colors.primary}50` }}
                  thumbColor={radar.active ? colors.primary : colors.text.tertiary}
                />
              </View>
              {radar.hits > 0 && (
                <View style={styles.radarHits}>
                  <Text style={styles.radarHitsText}>
                    ⚡ {radar.hits} فرصت پیدا شده
                  </Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* تاریخچه اعلان‌ها */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 اعلان‌های اخیر</Text>

          {MOCK_NOTIFICATIONS.map((notif) => (
            <Card key={notif.id} style={styles.notifCard}>
              <View style={styles.notifHeader}>
                <View style={[styles.notifDot, { backgroundColor: getNotifColor(notif.type) }]} />
                <Text style={styles.notifTitle}>{notif.title}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
              <Text style={styles.notifMessage}>{notif.message}</Text>
            </Card>
          ))}
        </View>
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
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  addButtonText: {
    ...typography.captionBold,
    color: colors.text.inverse,
  },

  // بخش‌ها
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    textAlign: 'right',
  },
  sectionSubtitle: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  // رادار
  radarCard: {
    marginBottom: spacing.md,
  },
  radarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radarInfo: {
    flex: 1,
  },
  radarName: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  radarDetails: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  radarHits: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.secondary,
  },
  radarHitsText: {
    ...typography.captionBold,
    color: colors.status.safe,
  },

  // اعلان‌ها
  notifCard: {
    marginBottom: spacing.sm,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  notifTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    flex: 1,
  },
  notifTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  notifMessage: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    paddingLeft: spacing.xl,
  },
});

export default AlertsScreen;
