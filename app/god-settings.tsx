
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { defaultGameSettings } from '@/data/gameData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionCard: {
    ...commonStyles.card,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
    flex: 1,
  },
  settingValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 16,
  },
  timeInput: {
    ...commonStyles.input,
    width: 80,
    textAlign: 'center',
    marginLeft: 16,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginLeft: 16,
  },
  switchActive: {
    backgroundColor: colors.success,
  },
  switchInactive: {
    backgroundColor: colors.highlight,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  saveButton: {
    ...commonStyles.button,
    backgroundColor: colors.success,
    marginTop: 20,
  },
  resetButton: {
    ...commonStyles.button,
    backgroundColor: colors.secondary,
    marginTop: 8,
  },
});

export default function GodSettingsScreen() {
  const [settings, setSettings] = useState({
    minPlayers: defaultGameSettings.minPlayers,
    maxPlayers: defaultGameSettings.maxPlayers,
    speakingTimeIntro: defaultGameSettings.speakingTimeIntro,
    speakingTimeRegular: defaultGameSettings.speakingTimeRegular,
    challengeTime: defaultGameSettings.challengeTime,
    defenseTime: defaultGameSettings.defenseTime,
    safeMode: defaultGameSettings.safeMode,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleSafeMode = () => {
    updateSetting('safeMode', !settings.safeMode);
  };

  const handleSave = () => {
    // Validate settings
    if (settings.minPlayers < 3 || settings.minPlayers > settings.maxPlayers) {
      Alert.alert('خطا', 'حداقل تعداد بازیکن باید ۳ و کمتر از حداکثر باشد');
      return;
    }

    if (settings.maxPlayers > 12) {
      Alert.alert('خطا', 'حداکثر تعداد بازیکن ۱۲ نفر است');
      return;
    }

    console.log('Settings saved:', settings);
    Alert.alert('موفق', 'تنظیمات ذخیره شد', [
      { text: 'باشه', onPress: () => router.back() }
    ]);
  };

  const handleReset = () => {
    Alert.alert(
      'بازنشانی تنظیمات',
      'آیا مطمئن هستید که می‌خواهید تنظیمات را به حالت پیش‌فرض برگردانید؟',
      [
        { text: 'لغو', style: 'cancel' },
        { 
          text: 'بازنشانی', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              minPlayers: defaultGameSettings.minPlayers,
              maxPlayers: defaultGameSettings.maxPlayers,
              speakingTimeIntro: defaultGameSettings.speakingTimeIntro,
              speakingTimeRegular: defaultGameSettings.speakingTimeRegular,
              challengeTime: defaultGameSettings.challengeTime,
              defenseTime: defaultGameSettings.defenseTime,
              safeMode: defaultGameSettings.safeMode,
            });
          }
        }
      ]
    );
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} ثانیه`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} دقیقه` : `${minutes} دقیقه`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'تنظیمات گاد',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: 'بازگشت',
        }}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Player Settings */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
            تنظیمات بازیکنان
          </Text>
          
          <View style={styles.settingItem}>
            <TextInput
              style={styles.timeInput}
              value={settings.minPlayers.toString()}
              onChangeText={(text) => updateSetting('minPlayers', parseInt(text) || 3)}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              حداقل تعداد بازیکن
            </Text>
          </View>

          <View style={styles.settingItem}>
            <TextInput
              style={styles.timeInput}
              value={settings.maxPlayers.toString()}
              onChangeText={(text) => updateSetting('maxPlayers', parseInt(text) || 12)}
              keyboardType="numeric"
              maxLength={2}
            />
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              حداکثر تعداد بازیکن
            </Text>
          </View>
        </View>

        {/* Time Settings */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
            تنظیمات زمان
          </Text>
          
          <View style={styles.settingItem}>
            <TextInput
              style={styles.timeInput}
              value={settings.speakingTimeIntro.toString()}
              onChangeText={(text) => updateSetting('speakingTimeIntro', parseInt(text) || 40)}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              زمان صحبت در معارفه (ثانیه)
            </Text>
          </View>

          <View style={styles.settingItem}>
            <TextInput
              style={styles.timeInput}
              value={settings.speakingTimeRegular.toString()}
              onChangeText={(text) => updateSetting('speakingTimeRegular', parseInt(text) || 120)}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              زمان صحبت عادی (ثانیه)
            </Text>
          </View>

          <View style={styles.settingItem}>
            <TextInput
              style={styles.timeInput}
              value={settings.challengeTime.toString()}
              onChangeText={(text) => updateSetting('challengeTime', parseInt(text) || 60)}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              زمان چالش (ثانیه)
            </Text>
          </View>

          <View style={styles.settingItem}>
            <TextInput
              style={styles.timeInput}
              value={settings.defenseTime.toString()}
              onChangeText={(text) => updateSetting('defenseTime', parseInt(text) || 120)}
              keyboardType="numeric"
              maxLength={3}
            />
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              زمان دفاعیه (ثانیه)
            </Text>
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
            تنظیمات امنیتی
          </Text>
          
          <View style={styles.settingItem}>
            <Pressable onPress={toggleSafeMode} style={styles.row}>
              <View style={[
                styles.switch,
                settings.safeMode ? styles.switchActive : styles.switchInactive
              ]}>
                <View style={[
                  styles.switchThumb,
                  { alignSelf: settings.safeMode ? 'flex-end' : 'flex-start' }
                ]} />
              </View>
            </Pressable>
            <Text style={[styles.settingLabel, commonStyles.rtlText]}>
              حالت امن (تشخیص تقلب)
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
            ذخیره تنظیمات
          </Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
            بازنشانی به حالت پیش‌فرض
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
