
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { keepAwake, allowSleepAsync } from 'react-native-keep-awake';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  statusCard: {
    ...commonStyles.card,
    alignItems: 'center',
    width: '100%',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  playerCount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default function PlayerWaitingScreen() {
  const [connectedPlayers, setConnectedPlayers] = useState(1);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'starting' | 'ready'>('waiting');

  useEffect(() => {
    keepAwake();
    
    // Simulate player connections
    const interval = setInterval(() => {
      setConnectedPlayers(prev => {
        const newCount = prev + Math.floor(Math.random() * 2);
        return Math.min(newCount, 8); // Max 8 players for demo
      });
    }, 3000);

    return () => {
      allowSleepAsync();
      clearInterval(interval);
    };
  }, []);

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'waiting':
        return 'در انتظار سایر بازیکنان و شروع بازی توسط گاد';
      case 'starting':
        return 'بازی در حال شروع است...';
      case 'ready':
        return 'آماده شروع بازی';
      default:
        return 'در حال اتصال...';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'انتظار برای شروع',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <View style={styles.statusCard}>
        <Text style={[styles.statusTitle, commonStyles.rtlText]}>
          متصل شدید!
        </Text>
        
        <Text style={[styles.statusText, commonStyles.rtlText]}>
          {getStatusMessage()}
        </Text>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, commonStyles.rtlText]}>
            در انتظار...
          </Text>
        </View>

        <Text style={[styles.playerCount, commonStyles.rtlText]}>
          بازیکنان متصل: {connectedPlayers}
        </Text>

        <Text style={[styles.instructionText, commonStyles.rtlText]}>
          لطفاً صفحه گوشی خود را روشن نگه دارید{'\n'}
          بازی به زودی شروع خواهد شد
        </Text>
      </View>
    </View>
  );
}
