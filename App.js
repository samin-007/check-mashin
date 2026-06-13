/**
 * چک‌ماشین — اپلیکیشن اصلی (Expo)
 * رادار فرصت خرید + تشخیص کلاهبرداری خودرو
 */

import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';
import { colors } from './src/theme';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" backgroundColor={colors.background.primary} />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" backgroundColor={colors.background.primary} />
      <AppNavigator />
    </>
  );
};

export default App;
