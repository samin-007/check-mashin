/**
 * چک‌ماشین — اپلیکیشن اصلی (با فونت Vazirmatn)
 */

import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreenExpo from 'expo-splash-screen';
import { AppNavigator } from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';
import { colors } from './src/theme';

// جلوگیری از بسته شدن Splash قبل از لود فونت
SplashScreenExpo.preventAutoHideAsync();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  // لود فونت Vazirmatn
  const [fontsLoaded] = useFonts({
    'Vazirmatn': require('./src/assets/fonts/Vazirmatn-Regular.ttf'),
    'Vazirmatn-Bold': require('./src/assets/fonts/Vazirmatn-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenExpo.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (showSplash) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar style="light" backgroundColor={colors.background.primary} />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="light" backgroundColor={colors.background.primary} />
      <AppNavigator />
    </View>
  );
};

export default App;
