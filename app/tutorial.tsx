
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { gameRoles, finalCards } from '@/data/gameData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.card,
  },
  sectionCard: {
    ...commonStyles.card,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  sectionText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 8,
  },
  roleCard: {
    ...commonStyles.card,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cityRole: {
    borderLeftColor: colors.primary,
  },
  mafiaRole: {
    borderLeftColor: colors.secondary,
  },
  independentRole: {
    borderLeftColor: colors.accent,
  },
  roleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  roleTeam: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
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
  roleDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'right',
  },
  finalCardCard: {
    ...commonStyles.card,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  finalCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  finalCardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'right',
  },
});

const tabs = [
  { id: 'rules', title: 'قوانین بازی' },
  { id: 'roles', title: 'نقش‌ها' },
  { id: 'cards', title: 'کارت‌های پایانی' },
];

export default function TutorialScreen() {
  const [activeTab, setActiveTab] = useState('rules');

  const renderTab = (tab: typeof tabs[0]) => (
    <Pressable
      key={tab.id}
      style={[styles.tab, activeTab === tab.id && styles.activeTab]}
      onPress={() => setActiveTab(tab.id)}
    >
      <Text style={[
        styles.tabText,
        activeTab === tab.id && styles.activeTabText,
        commonStyles.rtlText
      ]}>
        {tab.title}
      </Text>
    </Pressable>
  );

  const renderRulesContent = () => (
    <>
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
          هدف بازی
        </Text>
        <Text style={[styles.sectionText, commonStyles.rtlText]}>
          • شهروندان: تمام مافیاها و نقش‌های مستقل را حذف کنند{'\n'}
          • مافیا: تعداد مافیاها برابر یا بیشتر از شهروندان شود{'\n'}
          • نقش‌های مستقل: هر کدام هدف خاص خود را دارند
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
          مراحل بازی
        </Text>
        <Text style={[styles.sectionText, commonStyles.rtlText]}>
          ۱. معارفه (روز ۰): هر بازیکن ۴۰ ثانیه خودش را معرفی می‌کند{'\n'}
          ۲. شب اول: نقش‌ها فعال می‌شوند{'\n'}
          ۳. روز اول: بحث و رای‌گیری (هر نفر ۲ دقیقه){'\n'}
          ۴. تکرار شب و روز تا پایان بازی
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
          قوانین صحبت
        </Text>
        <Text style={[styles.sectionText, commonStyles.rtlText]}>
          • در معارفه: ۴۰ ثانیه برای هر نفر{'\n'}
          • در روزهای عادی: ۲ دقیقه برای هر نفر{'\n'}
          • چالش: ۱ دقیقه از وقت صحبت‌کننده کم می‌شود{'\n'}
          • دفاعیه: ۲ دقیقه برای دفاع از خود
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
          رای‌گیری
        </Text>
        <Text style={[styles.sectionText, commonStyles.rtlText]}>
          • اگر کسی اکثریت آرا را بگیرد، به دفاعیه می‌رود{'\n'}
          • پس از دفاعیه، رای‌گیری نهایی انجام می‌شود{'\n'}
          • فرد اعدام شده یکی از کارت‌های پایانی را دریافت می‌کند
        </Text>
      </View>
    </>
  );

  const renderRolesContent = () => (
    <>
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
          تیم‌های بازی
        </Text>
        <Text style={[styles.sectionText, commonStyles.rtlText]}>
          • <Text style={styles.cityTeam}>شهر (آبی)</Text>: دفاع از شهر و حذف مافیا{'\n'}
          • <Text style={styles.mafiaTeam}>مافیا (قرمز)</Text>: کنترل شهر و حذف شهروندان{'\n'}
          • <Text style={styles.independentTeam}>مستقل (زرد)</Text>: اهداف شخصی
        </Text>
      </View>

      {gameRoles.map((role) => (
        <View
          key={role.id}
          style={[
            styles.roleCard,
            role.team === 'city' && styles.cityRole,
            role.team === 'mafia' && styles.mafiaRole,
            role.team === 'independent' && styles.independentRole,
          ]}
        >
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
          {role.description.map((desc, index) => (
            <Text key={index} style={[styles.roleDescription, commonStyles.rtlText]}>
              • {desc}
            </Text>
          ))}
        </View>
      ))}
    </>
  );

  const renderCardsContent = () => (
    <>
      <View style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, commonStyles.rtlText]}>
          کارت‌های پایانی
        </Text>
        <Text style={[styles.sectionText, commonStyles.rtlText]}>
          وقتی بازیکنی از بازی خارج می‌شود، یکی از این کارت‌ها را به صورت تصادفی دریافت می‌کند.
          این کارت‌ها می‌توانند تأثیر زیادی روی ادامه بازی داشته باشند.
        </Text>
      </View>

      {finalCards.map((card) => (
        <View key={card.id} style={styles.finalCardCard}>
          <Text style={[styles.finalCardName, commonStyles.rtlText]}>
            {card.name}
          </Text>
          {card.description.map((desc, index) => (
            <Text key={index} style={[styles.finalCardDescription, commonStyles.rtlText]}>
              • {desc}
            </Text>
          ))}
        </View>
      ))}
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'rules':
        return renderRulesContent();
      case 'roles':
        return renderRolesContent();
      case 'cards':
        return renderCardsContent();
      default:
        return renderRulesContent();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'آموزش بازی',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerBackTitle: 'بازگشت',
        }}
      />

      <View style={styles.tabContainer}>
        {tabs.map(renderTab)}
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}
