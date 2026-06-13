/**
 * چک‌ماشین — Navigation اصلی
 * Bottom Tab با تم خودرویی
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DashboardScreen,
  CheckScreen,
  OpportunitiesScreen,
  AlertsScreen,
  MarketScreen,
} from '@screens';
import { colors, typography, spacing } from '@theme';

const Tab = createBottomTabNavigator();

// آیکون‌های ساده (بعداً با react-native-vector-icons جایگزین می‌شه)
const TabIcon = ({ label, focused }) => {
  const icons = {
    'خانه': '🏠',
    'چک آگهی': '🔍',
    'فرصت‌ها': '🔥',
    'هشدارها': '🔔',
    'بازار': '📊',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
        {icons[label]}
      </Text>
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => (
            <TabIcon label={route.name} focused={focused} />
          ),
        })}
      >
        <Tab.Screen name="خانه" component={DashboardScreen} />
        <Tab.Screen name="چک آگهی" component={CheckScreen} />
        <Tab.Screen name="فرصت‌ها" component={OpportunitiesScreen} />
        <Tab.Screen name="هشدارها" component={AlertsScreen} />
        <Tab.Screen name="بازار" component={MarketScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.secondary,
    borderTopColor: colors.border.primary,
    borderTopWidth: 1,
    height: 65,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 20,
    opacity: 0.5,
  },
  tabEmojiActive: {
    opacity: 1,
  },
});

export default AppNavigator;
