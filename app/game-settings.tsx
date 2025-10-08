
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { gameRoles, finalCards, defaultGameSettings } from '@/data/gameData';

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
  roleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    marginBottom: 4,
  },
  roleTeam: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  cityTeam: {
    color: colors.primary,
  },
  mafiaTeam: {
    color: colors.secondary,
  },
  independentTeam: {
    color: colors.accent,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardItemSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
  },
  selectionCounter: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 12,
  },
  startButton: {
    ...commonStyles.button,
    backgroundColor: colors.success,
    marginTop: 20,
  },
  startButtonDisabled: {
    backgroundColor: colors.highlight,
  },
  warningText: {
    fontSize: 12,
    color: colors.danger,
    textAlign: 'right',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default function GameSettingsScreen() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedFinalCards, setSelectedFinalCards] = useState<string[]>([]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const toggleFinalCard = (cardId: string) => {
    setSelectedFinalCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const canStartGame = () => {
    return selectedRoles.length >= 3 && selectedFinalCards.length >= 4;
  };

  const handleStartGame = () => {
    if (!canStartGame()) {
      Alert.alert(
        'تنظیمات ناکامل',
        'لطفاً حداقل ۳ نقش و ۴ کارت پایانی انتخاب کنید'
      );
      return;
    }

    Alert.alert(
      'شروع بازی',
      'آیا مطمئن هستید که می‌خواهید بازی را شروع کنید؟',
      [
        { text: 'لغو', style: 'cancel' },
        { 
          text: 'شروع', 
          onPress: () => {
            console.log('Starting game with:', { selectedRoles, selectedFinalCards });
            router.push('/game-master');
          }
        }
      ]
    );
  };

  const renderRole = (role: typeof gameRoles[0]) => {
    const isSelected = selectedRoles.includes(role.id);
    
    return (
      <Pressable
        key={role.id}
        style={[styles.roleItem, isSelected && styles.roleItemSelected]}
        onPress={() => toggleRole(role.id)}
      >
        <View style={styles.roleInfo}>
          <Text style={[styles.roleName, commonStyles.rtlText]}>
            {role.name}
          </Text>
          <Text style={[
            styles.roleTeam,
            role.team === 'city' && styles.cityTeam,
            role.team === 'mafia' && styles.mafiaTeam,
            role.team === 'independent' && styles.independentTeam,
            commonStyles.rtlText
          ]}>
            {role.team === 'city' ? 'شهر' : role.team === 'mafia' ? 'مافیا' : 'مستقل'}
          </Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <IconSymbol name="checkmark" size={16} color={colors.card} />
          )}
        </View>
      </Pressable>
    );
  };

  const renderFinalCard = (card: typeof finalCards[0]) => {
    const isSelected = selectedFinalCards.includes(card.id);
    
    return (
      <Pressable
        key={card.id}
        style={[styles.cardItem, isSelected && styles.cardItemSelected]}
        onPress={() => toggleFinalCard(card.id)}
      >
        <Text style={[styles.cardName, commonStyles.rtlText]}>
          {card.name}
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <IconSymbol name="checkmark" size={16} color={colors.card} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'تنظیمات بازی',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: 'بازگشت',
        }}
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Role Selection */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
            انتخاب نقش‌ها
          </Text>
          <Text style={[styles.selectionCounter, commonStyles.rtlText]}>
            انتخاب شده: {selectedRoles.length} از {gameRoles.length}
          </Text>
          {selectedRoles.length < 3 && (
            <Text style={[styles.warningText, commonStyles.rtlText]}>
              حداقل ۳ نقش باید انتخاب شود
            </Text>
          )}
          
          {gameRoles.map(renderRole)}
        </View>

        {/* Final Cards Selection */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
            انتخاب کارت‌های پایانی
          </Text>
          <Text style={[styles.selectionCounter, commonStyles.rtlText]}>
            انتخاب شده: {selectedFinalCards.length} از {finalCards.length}
          </Text>
          {selectedFinalCards.length < 4 && (
            <Text style={[styles.warningText, commonStyles.rtlText]}>
              حداقل ۴ کارت پایانی باید انتخاب شود
            </Text>
          )}
          
          {finalCards.map(renderFinalCard)}
        </View>

        {/* Start Game Button */}
        <Pressable
          style={[
            styles.startButton,
            !canStartGame() && styles.startButtonDisabled
          ]}
          onPress={handleStartGame}
          disabled={!canStartGame()}
        >
          <Text style={[commonStyles.buttonText, commonStyles.rtlText]}>
            شروع بازی
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
