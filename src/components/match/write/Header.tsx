import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "../../../styles/colors";

type HeaderProps = {
  title: string;
  subtitle: string;
  backText: string;
  onBack: () => void;
};

export const Header = ({ title, subtitle, backText, onBack }: HeaderProps) => (
  <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <ArrowLeft color={colors.grey.light} size={24} />
      <Text style={styles.backButtonText}>{backText}</Text>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey.medium,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 20,
  },
  backButtonText: {
    color: colors.grey.light,
    fontSize: 16,
  },
});
