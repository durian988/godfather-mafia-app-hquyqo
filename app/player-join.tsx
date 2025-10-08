
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { keepAwake, allowSleepAsync } from 'react-native-keep-awake';
import uuid from 'react-native-uuid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  instructionCard: {
    ...commonStyles.card,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
  },
  inputCard: {
    ...commonStyles.card,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    ...commonStyles.input,
    textAlign: 'right',
  },
  connectButton: {
    ...commonStyles.button,
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  connectButtonDisabled: {
    backgroundColor: colors.highlight,
  },
  scanButton: {
    ...commonStyles.button,
    backgroundColor: colors.secondary,
    marginTop: 8,
  },
  statusCard: {
    ...commonStyles.card,
    marginTop: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  connected: {
    backgroundColor: colors.success,
  },
  connecting: {
    backgroundColor: colors.warning,
  },
  disconnected: {
    backgroundColor: colors.danger,
  },
  waitingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default function PlayerJoinScreen() {
  const [serverAddress, setServerAddress] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [hiddenId] = useState(uuid.v4() as string);

  useEffect(() => {
    // Keep screen awake
    keepAwake();

    return () => {
      allowSleepAsync();
    };
  }, []);

  const validateInputs = () => {
    if (!serverAddress.trim()) {
      Alert.alert('خطا', 'لطفاً آدرس سرور را وارد کنید');
      return false;
    }

    if (!playerName.trim()) {
      Alert.alert('خطا', 'لطفاً نام خود را وارد کنید');
      return false;
    }

    if (playerName.trim().length < 2) {
      Alert.alert('خطا', 'نام باید حداقل ۲ کاراکتر باشد');
      return false;
    }

    // Validate server address format
    const urlPattern = /^https?:\/\/[\d.]+:\d+$/;
    if (!urlPattern.test(serverAddress.trim())) {
      Alert.alert('خطا', 'فرمت آدرس سرور صحیح نیست\nمثال: http://192.168.1.100:3000');
      return false;
    }

    return true;
  };

  const handleConnect = async () => {
    if (!validateInputs()) return;

    setConnectionStatus('connecting');

    try {
      // Simulate connection attempt
      console.log('Connecting to server:', serverAddress);
      console.log('Player name:', playerName);
      console.log('Hidden ID:', hiddenId);

      // In a real implementation, you would connect to the server here
      setTimeout(() => {
        setConnectionStatus('connected');
        router.push('/player-waiting');
      }, 2000);

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('disconnected');
      Alert.alert('خطای اتصال', 'نتوانستیم به سرور متصل شویم. لطفاً آدرس را بررسی کنید.');
    }
  };

  const handleScanQR = () => {
    // In a real implementation, you would open camera to scan QR code
    Alert.alert('اسکن QR کد', 'این قابلیت به زودی اضافه خواهد شد');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return styles.connected;
      case 'connecting': return styles.connecting;
      default: return styles.disconnected;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'متصل به سرور';
      case 'connecting': return 'در حال اتصال...';
      default: return 'قطع شده';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'پیوستن به بازی',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: 'بازگشت',
        }}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <View style={styles.instructionCard}>
          <Text style={[styles.instructionTitle, commonStyles.rtlText]}>
            راهنمای اتصال
          </Text>
          <Text style={[styles.instructionText, commonStyles.rtlText]}>
            • آدرس سرور را از گاد بازی دریافت کنید{'\n'}
            • نام خود را وارد کنید (حداقل ۲ کاراکتر){'\n'}
            • روی دکمه اتصال کلیک کنید{'\n'}
            • منتظر شروع بازی توسط گاد باشید
          </Text>
        </View>

        {/* Server Address Input */}
        <View style={styles.inputCard}>
          <Text style={[styles.inputLabel, commonStyles.rtlText]}>
            آدرس سرور
          </Text>
          <TextInput
            style={styles.input}
            value={serverAddress}
            onChangeText={setServerAddress}
            placeholder="http://192.168.1.100:3000"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>

        {/* Player Name Input */}
        <View style={styles.inputCard}>
          <Text style={[styles.inputLabel, commonStyles.rtlText]}>
            نام بازیکن
          </Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="نام خود را وارد کنید"
            placeholderTextColor={colors.textSecondary}
            maxLength={20}
          />
        </View>

        {/* Action Buttons */}
        <Pressable
          style={[
            styles.connectButton,
            (connectionStatus === 'connecting' || !serverAddress.trim() || !playerName.trim()) && styles.connectButtonDisabled
          ]}
          onPress={handleConnect}
          disabled={connectionStatus === 'connecting' || !serverAddress.trim() || !playerName.trim()}
        >
          <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
            {connectionStatus === 'connecting' ? 'در حال اتصال...' : 'اتصال به بازی'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={handleScanQR}>
          <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
            اسکن QR کد
          </Text>
        </Pressable>

        {/* Connection Status */}
        {connectionStatus !== 'disconnected' && (
          <View style={styles.statusCard}>
            <View style={[styles.statusIndicator, getStatusColor()]} />
            <Text style={[styles.statusText, commonStyles.rtlText]}>
              {getStatusText()}
            </Text>
            {connectionStatus === 'connected' && (
              <Text style={[styles.waitingText, commonStyles.rtlText]}>
                منتظر شروع بازی توسط گاد باشید...
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
