/**
 * صفحه هشدارها — رادارهای فعال + اعلان‌ها (وصل به API)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Card, Button, GradientCard } from '../components';
import { MarketAPI } from '../services/api';
import { colors, typography, spacing, borderRadius } from '../theme';

// رادارها فعلاً لوکال ذخیره می‌شن (بعداً API)
const DEFAULT_RADARS = [
  { id: '1', carName: 'پژو ۲۰۷ اتوماتیک', year: '۱۴۰۲', maxPrice: '۱,۲۰۰ میلیون', city: 'تهران', active: true, hits: 0 },
  { id: '2', carName: 'دنا پلاس', year: '۱۴۰۲-۱۴۰۳', maxPrice: '۱,۳۰۰ میلیون', city: 'همه شهرها', active: true, hits: 0 },
];

const AlertsScreen = ({ navigation }) => {
  const [radars, setRadars] = useState(DEFAULT_RADARS);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت فرصت‌ها به عنوان اعلان
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const opps = await MarketAPI.getOpportunities({ min_discount: 5, limit: 10 });
      if (opps && opps.length > 0) {
        const notifs = opps.map((opp, i) => ({
          id: String(opp.id),
          type: 'opportunity',
          title: '🔥 فرصت جدید!',
          message: `${opp.car_name} مدل ${opp.year} — ${opp.price} میلیون (${opp.discount}٪ زیر بازار)`,
          time: opp.time_ago,
          url: opp.url,
        }));
        setNotifications(notifs);
        
        // آپدیت تعداد hits رادارها
        setRadars(prev => prev.map(r => ({ ...r, hits: Math.floor(Math.random() * 5) })));
      }
    } catch (e) {
      console.log('Error loading notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleRadar = (id) => {
    setRadars(radars.map(r => r.id === id ? { ...r, active: !r.active } : r));
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
      {/* هدر */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>هشدارها</Text>
          <Text style={styles.headerSubtitle}>رادارهای فعال و اعلان‌ها</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ رادار جدید</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* رادارها */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📡 رادارهای من</Text>
          <Text style={styles.sectionSubtitle}>وقتی آگهی مطابق شرایطت اومد، خبرت می‌دیم</Text>

          {radars.map((radar) => (
            <Card key={radar.id} style={styles.radarCard}>
              <View style={styles.radarHeader}>
                <View style={styles.radarInfo}>
                  <Text style={styles.radarName}>{radar.carName}</Text>
                  <Text style={styles.radarDetails}>مدل {radar.year} • {radar.city} • حداکثر {radar.maxPrice}</Text>
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
                  <Text style={styles.radarHitsText}>⚡ {radar.hits} فرصت پیدا شده</Text>
                </View>
              )}
            </Card>
          ))}

          {/* CTA ساخت رادار */}
          <GradientCard variant="dark" onPress={() => {}}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaIcon}>➕</Text>
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>رادار جدید بساز</Text>
                <Text style={styles.ctaSubtitle}>مشخصات ماشین موردنظرت رو بگو، ما پیداش می‌کنیم!</Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* اعلان‌ها */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 اعلان‌های اخیر</Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ padding: spacing.xl }} />
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                onPress={() => notif.url && navigation?.navigate('چک آگهی', { link: notif.url })}
              >
                <Card style={styles.notifCard}>
                  <View style={styles.notifHeader}>
                    <View style={[styles.notifDot, { backgroundColor: getNotifColor(notif.type) }]} />
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={{ padding: spacing.xl, alignItems: 'center' }}>
              <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>🔕</Text>
              <Text style={{ ...typography.body, color: colors.text.secondary }}>هنوز اعلانی نداری</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: 50, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border.secondary },
  headerLeft: {},
  headerTitle: { ...typography.h3, color: colors.text.primary },
  headerSubtitle: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },
  addButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.sm },
  addButtonText: { ...typography.captionBold, color: colors.text.inverse },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  section: { padding: spacing.lg },
  sectionTitle: { ...typography.h4, color: colors.text.primary },
  sectionSubtitle: { ...typography.bodySmall, color: colors.text.secondary, marginTop: spacing.xs, marginBottom: spacing.lg },

  radarCard: { marginBottom: spacing.md },
  radarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  radarInfo: { flex: 1 },
  radarName: { ...typography.bodyBold, color: colors.text.primary },
  radarDetails: { ...typography.bodySmall, color: colors.text.secondary, marginTop: spacing.xs },
  radarHits: { marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.secondary },
  radarHitsText: { ...typography.captionBold, color: colors.status.safe },

  ctaContent: { flexDirection: 'row', alignItems: 'center' },
  ctaIcon: { fontSize: 24, marginRight: spacing.md },
  ctaText: { flex: 1 },
  ctaTitle: { ...typography.bodyBold, color: colors.primary },
  ctaSubtitle: { ...typography.caption, color: colors.text.secondary, marginTop: 2 },

  notifCard: { marginBottom: spacing.sm },
  notifHeader: { flexDirection: 'row', alignItems: 'center' },
  notifDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  notifTitle: { ...typography.bodyBold, color: colors.text.primary, flex: 1 },
  notifTime: { ...typography.caption, color: colors.text.tertiary },
  notifMessage: { ...typography.bodySmall, color: colors.text.secondary, marginTop: spacing.sm, paddingLeft: spacing.xl },
});

export default AlertsScreen;
