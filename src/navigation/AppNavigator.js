/**
 * چک‌ماشین — Navigation (آیکون‌های سفید/سبز)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import CheckScreen from '../screens/CheckScreen';
import OpportunitiesScreen from '../screens/OpportunitiesScreen';
import AlertsScreen from '../screens/AlertsScreen';
import MarketScreen from '../screens/MarketScreen';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();

// آیکون‌های ساده Unicode (سفید، سبز وقتی فعال)
const TabIcon = ({ name, focused }) => {
  const icons = {
    'خانه': '⌂',
    'چک آگهی': '⊘',
    'فرصت‌ها': '◈',
    'هشدارها': '⊙',
    'بازار': '⊞',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, { color: focused ? colors.primary : '#ffffff' }]}>
        {icons[name]}
      </Text>
      {focused && <View style={styles.tabDot} />}
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
          tabBarInactiveTintColor: '#ffffff',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
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
    fontSize: 10,
    fontWeight: '600',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    fontWeight: '700',
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
});

export default AppNavigator;
