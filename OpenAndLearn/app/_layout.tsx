import { useSettingsStore } from '@/src/stores/settingsStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  const { settings, isLoaded, loadSettings } = useSettingsStore();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadSettings().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady || !isLoaded) return;

    // オンボーディング未完了の場合はオンボーディング画面へ
    if (!settings.onboardingCompleted) {
      router.replace('/onboarding');
    }
  }, [isReady, isLoaded, settings.onboardingCompleted]);

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#F8F8FC' },
          headerTintColor: '#1C1C1E',
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F8F8FC' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'OpenAndLearn', headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="quiz" options={{ title: '問題', headerBackTitle: '戻る' }} />
        <Stack.Screen name="unlock-result" options={{ title: '結果', headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="rule-settings" options={{ title: 'ルール設定', headerBackTitle: '戻る' }} />
        <Stack.Screen name="app-selection" options={{ title: '対象アプリ', headerBackTitle: '戻る' }} />
        <Stack.Screen name="history" options={{ title: '学習履歴', headerBackTitle: '戻る' }} />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
  },
});
