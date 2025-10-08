
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Network from 'expo-network';
import QRCode from 'react-native-qrcode-svg';
import { keepAwake, allowSleepAsync } from 'react-native-keep-awake';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  serverCard: {
    ...commonStyles.card,
    alignItems: 'center',
    marginTop: 20,
  },
  serverTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  ipAddress: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
  },
  playersCard: {
    ...commonStyles.card,
    marginTop: 16,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  playerName: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  playerStatus: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  connected: {
    backgroundColor: colors.success,
  },
  disconnected: {
    backgroundColor: colors.danger,
  },
  startButton: {
    ...commonStyles.button,
    marginTop: 16,
    backgroundColor: colors.accent,
  },
  startButtonDisabled: {
    backgroundColor: colors.highlight,
  },
  startButtonText: {
    ...commonStyles.buttonText,
    color: colors.text,
  },
  settingsButton: {
    ...commonStyles.button,
    backgroundColor: colors.secondary,
    marginTop: 8,
  },
  emptyPlayersText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  safeModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  safeModeText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
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
});

interface Player {
  id: string;
  name: string;
  hiddenId: string;
  isConnected: boolean;
  lastActivity: Date;
}

export default function GodSetupScreen() {
  const [serverIP, setServerIP] = useState<string>('');
  const [serverPort] = useState<number>(3000);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [safeMode, setSafeMode] = useState(true);

  useEffect(() => {
    // Keep screen awake
    keepAwake();
    
    // Get device IP address
    getDeviceIP();
    
    // Start HTTP server
    startServer();

    return () => {
      allowSleepAsync();
      // Stop server when component unmounts
      stopServer();
    };
  }, []);

  const getDeviceIP = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      console.log('Device IP:', ip);
      setServerIP(ip);
    } catch (error) {
      console.error('Error getting IP address:', error);
      Alert.alert('خطا', 'نتوانستیم آدرس IP دستگاه را پیدا کنیم');
    }
  };

  const startServer = async () => {
    try {
      // Note: In a real implementation, you would start an actual HTTP server here
      // For now, we'll simulate it
      console.log('Starting HTTP server...');
      setIsServerRunning(true);
      
      // Simulate server startup
      setTimeout(() => {
        console.log('Server started successfully');
      }, 1000);
    } catch (error) {
      console.error('Error starting server:', error);
      Alert.alert('خطا', 'نتوانستیم سرور را راه‌اندازی کنیم');
    }
  };

  const stopServer = () => {
    console.log('Stopping server...');
    setIsServerRunning(false);
  };

  const handleStartGame = () => {
    if (players.length < 3) {
      Alert.alert('تعداد بازیکن کافی نیست', 'حداقل ۳ بازیکن برای شروع بازی لازم است');
      return;
    }

    router.push('/game-settings');
  };

  const handleSettings = () => {
    router.push('/god-settings');
  };

  const toggleSafeMode = () => {
    setSafeMode(!safeMode);
  };

  const renderPlayer = (player: Player) => (
    <View key={player.id} style={styles.playerItem}>
      <View style={styles.row}>
        <View style={[
          styles.statusIndicator,
          player.isConnected ? styles.connected : styles.disconnected
        ]} />
        <Text style={styles.playerStatus}>
          {player.isConnected ? 'متصل' : 'قطع شده'}
        </Text>
      </View>
      <Text style={styles.playerName}>{player.name}</Text>
    </View>
  );

  const serverUrl = `http://${serverIP}:${serverPort}`;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'راه‌اندازی گاد',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: 'بازگشت',
        }}
      />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Server Information */}
        <View style={styles.serverCard}>
          <Text style={[styles.serverTitle, commonStyles.rtlText]}>
            اطلاعات سرور بازی
          </Text>
          
          {serverIP ? (
            <>
              <Text style={styles.ipAddress}>{serverUrl}</Text>
              
              <View style={styles.qrContainer}>
                <QRCode
                  value={serverUrl}
                  size={width * 0.4}
                  backgroundColor={colors.card}
                  color={colors.text}
                />
              </View>
              
              <Text style={[commonStyles.textSecondary, commonStyles.rtlText, { textAlign: 'center' }]}>
                بازیکنان می‌توانند با اسکن کردن این بارکد یا وارد کردن آدرس بالا به بازی بپیوندند
              </Text>
            </>
          ) : (
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              در حال دریافت آدرس IP...
            </Text>
          )}
        </View>

        {/* Safe Mode Toggle */}
        <View style={styles.safeModeContainer}>
          <Pressable onPress={toggleSafeMode} style={styles.row}>
            <View style={[
              styles.switch,
              safeMode ? styles.switchActive : styles.switchInactive
            ]}>
              <View style={[
                styles.switchThumb,
                { alignSelf: safeMode ? 'flex-end' : 'flex-start' }
              ]} />
            </View>
          </Pressable>
          <Text style={[styles.safeModeText, commonStyles.rtlText]}>
            حالت امن (تشخیص تقلب)
          </Text>
        </View>

        {/* Connected Players */}
        <View style={styles.playersCard}>
          <Text style={[styles.playersTitle, commonStyles.rtlText]}>
            بازیکنان متصل ({players.length})
          </Text>
          
          {players.length > 0 ? (
            players.map(renderPlayer)
          ) : (
            <Text style={[styles.emptyPlayersText, commonStyles.rtlText]}>
              هنوز هیچ بازیکنی متصل نشده است
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <Pressable
          style={[
            styles.startButton,
            players.length < 3 && styles.startButtonDisabled
          ]}
          onPress={handleStartGame}
          disabled={players.length < 3}
        >
          <Text style={[styles.startButtonText, commonStyles.rtlText]}>
            شروع بازی ({players.length}/12)
          </Text>
        </Pressable>

        <Pressable style={styles.settingsButton} onPress={handleSettings}>
          <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
            تنظیمات بازی
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
