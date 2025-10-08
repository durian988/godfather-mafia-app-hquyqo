import { ScrollView, Pressable, StyleSheet, View, Text, Alert } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { Stack, Link } from "expo-router";
import React from "react";
import { colors, commonStyles } from "@/styles/commonStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  welcomeCard: {
    ...commonStyles.card,
    marginTop: 20,
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  gameSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionCard: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  godIconContainer: {
    backgroundColor: colors.accent,
  },
  playerIconContainer: {
    backgroundColor: colors.secondary,
  },
});

const gameOptions = [
  {
    title: "گاد (مدیر بازی)",
    description: "بازی را کنترل کنید و بازیکنان را مدیریت کنید",
    href: "/god-setup",
    icon: "crown" as const,
    type: 'god',
  },
  {
    title: "بازیکن",
    description: "به بازی بپیوندید و نقش خود را بازی کنید",
    href: "/player-join",
    icon: "person" as const,
    type: 'player',
  },
  {
    title: "آموزش بازی",
    description: "قوانین و نحوه بازی کردن را یاد بگیرید",
    href: "/tutorial",
    icon: "book" as const,
    type: 'tutorial',
  },
];

export default function HomeScreen() {
  const renderGameOption = (item: typeof gameOptions[0]) => (
    <Link href={item.href} asChild key={item.title}>
      <Pressable style={styles.optionCard}>
        <View style={styles.optionContent}>
          <Text style={[styles.optionTitle, commonStyles.rtlText]}>{item.title}</Text>
          <Text style={[styles.optionDescription, commonStyles.rtlText]}>{item.description}</Text>
        </View>
        <View style={[
          styles.iconContainer,
          item.type === 'god' && styles.godIconContainer,
          item.type === 'player' && styles.playerIconContainer,
        ]}>
          <IconSymbol name={item.icon} size={24} color={colors.card} />
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "مافیا پدرخوانده",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.gameTitle}>مافیا پدرخوانده</Text>
          <Text style={[styles.gameSubtitle, commonStyles.rtlText]}>
            بازی استراتژیک و هیجان‌انگیز برای ۳ تا ۱۲ نفر
          </Text>
        </View>

        {gameOptions.map(renderGameOption)}
      </ScrollView>
    </View>
  );
}
