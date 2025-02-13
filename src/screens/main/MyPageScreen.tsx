// screens/MyPage.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Edit2 } from "lucide-react-native";
import { colors } from "../../styles/colors";
import LoggedInHeader from "../../components/common/LoggedInHeader";
import { ProfileDetails } from "../../components/profile/ProfileDetails";
import ParticipationList from "../../components/mypage/ParticipationList";
import { useUserProfile } from "../../utils/hooks/useUserProfile";
import { useLogout } from "../../utils/hooks/useLogout";
import { useParticipations } from "../../utils/hooks/useparticipations";
import EditProfileModal from "../../components/profile/EditProfileModal";
import { matchEventEmitter } from "../../utils/event";

export const MyPageScreen = () => {
  const handleLogout = useLogout();
  const {
    userProfile,
    isLoading: isProfileLoading,
    fetchProfile,
  } = useUserProfile();
  const { participations, isLoading, error, loadParticipations } =
    useParticipations();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    // 매치 생성 이벤트 리스너 등록
    const listener = () => {
      loadParticipations();
    };
    matchEventEmitter.addListener("matchCreated", listener);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      matchEventEmitter.removeListener("matchCreated", listener);
    };
  }, []);

  useEffect(() => {
    loadParticipations();
  }, [loadParticipations]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <SafeAreaView style={styles.container}>
      <LoggedInHeader />
      <ScrollView nestedScrollEnabled>
        <View style={styles.header}>
          <Text style={styles.title}>마이페이지</Text>
          <Text style={styles.subtitle}>내 정보와 활동 내역을 관리하세요</Text>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              {/* {userProfile?.profileImage ? (
                <Image
                  source={{ uri: userProfile.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <User color={colors.grey.light} size={48} />
              )} */}
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
                {/* {userProfile?.socialProvider && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {userProfile.socialProvider} 로그인
                    </Text>
                  </View>
                )} */}
              </View>

              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={styles.editProfileButton}
                  onPress={() => setIsEditModalVisible(true)}
                >
                  <Text style={styles.editProfileButtonText}>프로필 수정</Text>
                </TouchableOpacity>

                <EditProfileModal
                  isVisible={isEditModalVisible}
                  onClose={() => setIsEditModalVisible(false)}
                  currentProfile={userProfile} // userProfile을 그대로 전달
                  onUpdate={fetchProfile}
                />

                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>로그아웃</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {userProfile && (
            <ProfileDetails profile={userProfile} isLoading={isLoading} />
          )}
        </View>
        <ParticipationList
          participations={participations}
          onUpdate={loadParticipations}
        />
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
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  editProfileButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: colors.grey.dark,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey.medium,
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonGrid: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
});
