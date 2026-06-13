/**
 * چک‌ماشین — اپلیکیشن اصلی
 * رادار فرصت خرید + تشخیص کلاهبرداری خودرو
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';
import { colors } from './src/theme';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <AppNavigator />
    </>
  );
};

export default App;
