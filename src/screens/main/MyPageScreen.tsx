// screens/MyPage.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { User, Edit2 } from "lucide-react-native";
import { colors } from "../../styles/colors";
import LoggedInHeader from "../../components/common/LoggedInHeader";

type UserProfile = {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  height: number | null;
  weight: number | null;
  position: string | null;
  level: string | null;
  mannerScore: number;
  socialProvider: string | null;
  lastLoginAt: string;
};

const userProfile1 = {
  id: 1,
  email: "email@email.com",
  nickname: "nickname",
  profileImage: null,
  height: 187,
  weight: 80,
  position: "PG",
  level: "INTERMEDIATE",
  mannerScore: 100,
  socialProvider: "google",
  lastLoginAt: "yesterday",
};

export const MyPageScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    userProfile1
  );

  const getPositionText = (position: string | null) =>
    ({
      PG: "포인트 가드",
      SG: "슈팅 가드",
      SF: "스몰 포워드",
      PF: "파워 포워드",
      C: "센터",
    }[position || ""] || "미설정");

  const getLevelText = (level: string | null) =>
    level ? `${level}` : "미설정";

  const renderDetailItem = (label: string, value: string) => (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LoggedInHeader />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>마이페이지</Text>
          <Text style={styles.subtitle}>내 정보와 활동 내역을 관리하세요</Text>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              {userProfile?.profileImage ? (
                <Image
                  source={{ uri: userProfile.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <User color={colors.grey.light} size={48} />
              )}
              <TouchableOpacity style={styles.editButton}>
                <Edit2 color={colors.white} size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{userProfile?.nickname}</Text>
              <Text style={styles.email}>{userProfile?.email}</Text>

              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    매너 점수: {userProfile?.mannerScore.toFixed(1)}
                  </Text>
                </View>
                {userProfile?.socialProvider && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {userProfile.socialProvider} 로그인
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileButtonText}>프로필 수정</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            {renderDetailItem("포지션", getPositionText(userProfile!.position))}
            {renderDetailItem("실력", getLevelText(userProfile!.level))}
            {renderDetailItem(
              "신장",
              userProfile?.height ? `${userProfile.height}cm` : "미설정"
            )}
            {renderDetailItem(
              "체중",
              userProfile?.weight ? `${userProfile.weight}kg` : "미설정"
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  subtitle: {
    color: colors.grey.medium,
    marginTop: 8,
  },
  profileContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey.medium,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 24,
  },
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.grey.dark,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  email: {
    color: colors.grey.medium,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: colors.grey.dark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
  },
  editProfileButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  editProfileButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
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
});
