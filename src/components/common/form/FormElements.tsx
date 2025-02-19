import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";

export const ErrorMessage = ({ error }: { error: string }) => (
  <Text style={styles.fieldError}>{error}</Text>
);

export const RequiredLabel = ({ text }: { text: string }) => (
  <View style={styles.labelContainer}>
    <Text style={styles.label}>{text}</Text>
    <Text style={styles.requiredMark}>*</Text>
  </View>
);

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: colors.grey.light,
    fontSize: 16,
    fontWeight: "500",
  },
  requiredMark: {
    color: "#FF0000",
    marginLeft: 4,
    fontSize: 16,
  },
  fieldError: {
    color: "#FF0000",
    fontSize: 12,
    marginTop: 4,
  },
});
