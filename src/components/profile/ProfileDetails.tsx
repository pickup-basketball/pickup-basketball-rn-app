import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { getPositionText, getLevelText } from "../../utils/formatters";
import { UserProfile } from "../../types/mypage";
import { colors } from "../../styles/colors";

const renderDetailItem = (label: string, value: string) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export const ProfileDetails = ({
  profile,
  isLoading,
}: {
  profile: UserProfile;
  isLoading: boolean;
}) => (
  <View style={styles.detailsGrid}>
    {isLoading && (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    )}
    {renderDetailItem("포지션", getPositionText(profile.position))}
    {renderDetailItem("실력", getLevelText(profile.level))}
    {renderDetailItem(
      "신장",
      profile.height ? `${profile.height}cm` : "미설정"
    )}
    {renderDetailItem(
      "체중",
      profile.weight ? `${profile.weight}kg` : "미설정"
    )}
  </View>
);

const styles = StyleSheet.create({
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.grey.dark,
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    color: colors.grey.medium,
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.white,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: colors.white,
    fontSize: 16,
  },
});
