
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { keepAwake, allowSleepAsync } from 'react-native-keep-awake';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  gameStatusCard: {
    ...commonStyles.card,
    marginTop: 16,
    alignItems: 'center',
  },
  dayCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  phaseText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },
  timerCard: {
    ...commonStyles.card,
    marginTop: 16,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.secondary,
    marginBottom: 16,
  },
  speakerText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  controlsCard: {
    ...commonStyles.card,
    marginTop: 16,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  controlButton: {
    ...commonStyles.button,
    marginVertical: 4,
  },
  pauseButton: {
    backgroundColor: colors.warning,
  },
  nextButton: {
    backgroundColor: colors.success,
  },
  endButton: {
    backgroundColor: colors.danger,
  },
  playersCard: {
    ...commonStyles.card,
    marginTop: 16,
  },
  playersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
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
  alivePlayer: {
    color: colors.success,
  },
  deadPlayer: {
    color: colors.danger,
  },
});

interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  role?: string;
}

export default function GameMasterScreen() {
  const [gameDay, setGameDay] = useState(0); // 0 = معارفه
  const [gamePhase, setGamePhase] = useState<'day' | 'night' | 'voting'>('day');
  const [timeLeft, setTimeLeft] = useState(40); // seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const [players] = useState<Player[]>([
    { id: '1', name: 'علی', isAlive: true, role: 'دکتر' },
    { id: '2', name: 'سارا', isAlive: true, role: 'کارآگاه' },
    { id: '3', name: 'محمد', isAlive: true, role: 'پدرخوانده' },
    { id: '4', name: 'فاطمه', isAlive: false, role: 'شهروند' },
  ]);

  useEffect(() => {
    keepAwake();
    return () => allowSleepAsync();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handleTimeUp = () => {
    Alert.alert('زمان تمام شد', 'وقت صحبت این بازیکن به پایان رسید');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(gameDay === 0 ? 40 : 120); // 40s for معارفه, 2min for regular days
  };

  const handleNextPhase = () => {
    if (gamePhase === 'day') {
      setGamePhase('night');
      setTimeLeft(0);
      setIsTimerRunning(false);
    } else if (gamePhase === 'night') {
      setGameDay(prev => prev + 1);
      setGamePhase('day');
      setTimeLeft(120);
      setIsTimerRunning(false);
    }
  };

  const handleEndGame = () => {
    Alert.alert(
      'پایان بازی',
      'آیا مطمئن هستید که می‌خواهید بازی را پایان دهید؟',
      [
        { text: 'لغو', style: 'cancel' },
        { text: 'پایان', style: 'destructive', onPress: () => {
          // Handle game end
          console.log('Game ended');
        }}
      ]
    );
  };

  const getPhaseText = () => {
    if (gameDay === 0) return 'معارفه';
    return gamePhase === 'day' ? `روز ${gameDay}` : `شب ${gameDay}`;
  };

  const renderPlayer = (player: Player) => (
    <View key={player.id} style={styles.playerItem}>
      <Text style={[
        styles.playerStatus,
        player.isAlive ? styles.alivePlayer : styles.deadPlayer
      ]}>
        {player.isAlive ? 'زنده' : 'مرده'}
      </Text>
      <Text style={[styles.playerName, commonStyles.rtlText]}>
        {player.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'مدیریت بازی',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Game Status */}
        <View style={styles.gameStatusCard}>
          <Text style={[styles.dayCounter, commonStyles.rtlText]}>
            {getPhaseText()}
          </Text>
          <Text style={[styles.phaseText, commonStyles.rtlText]}>
            {gamePhase === 'day' ? 'مرحله روز - بحث و گفتگو' : 'مرحله شب - فعالیت نقش‌ها'}
          </Text>
        </View>

        {/* Timer */}
        <View style={styles.timerCard}>
          <Text style={styles.timerText}>
            {formatTime(timeLeft)}
          </Text>
          {currentSpeaker && (
            <Text style={[styles.speakerText, commonStyles.rtlText]}>
              نوبت صحبت: {currentSpeaker}
            </Text>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controlsCard}>
          <Text style={[styles.controlsTitle, commonStyles.rtlText]}>
            کنترل‌های بازی
          </Text>
          
          <Pressable
            style={[styles.controlButton, isTimerRunning ? styles.pauseButton : styles.nextButton]}
            onPress={isTimerRunning ? handlePauseTimer : handleStartTimer}
          >
            <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
              {isTimerRunning ? 'توقف تایمر' : 'شروع تایمر'}
            </Text>
          </Pressable>

          <Pressable style={styles.controlButton} onPress={handleResetTimer}>
            <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
              ریست تایمر
            </Text>
          </Pressable>

          <Pressable style={[styles.controlButton, styles.nextButton]} onPress={handleNextPhase}>
            <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
              {gamePhase === 'day' ? 'شروع شب' : 'شروع روز بعد'}
            </Text>
          </Pressable>

          <Pressable style={[styles.controlButton, styles.endButton]} onPress={handleEndGame}>
            <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
              پایان بازی
            </Text>
          </Pressable>
        </View>

        {/* Players List */}
        <View style={styles.playersCard}>
          <Text style={[styles.playersTitle, commonStyles.rtlText]}>
            وضعیت بازیکنان
          </Text>
          {players.map(renderPlayer)}
        </View>
      </ScrollView>
    </View>
  );
}
