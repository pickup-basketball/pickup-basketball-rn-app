import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MoreVertical, Edit2 } from "lucide-react-native";
import { colors } from "../../styles/colors";
import LoggedInHeader from "../../components/common/LoggedInHeader";
import { ProfileDetails } from "../../components/profile/ProfileDetails";
import ParticipationList from "../../components/mypage/ParticipationList";
import { useUserProfile } from "../../utils/hooks/useUserProfile";
import { useLogout } from "../../utils/hooks/useLogout";
import { useParticipations } from "../../utils/hooks/useParticipations";
import EditProfileModal from "../../components/profile/EditProfileModal";
import { matchEventEmitter } from "../../utils/event";
import WithdrawalModal from "../../components/mypage/WithdrawalModal";
import OptionsModal from "../../components/mypage/OptionsModal";
import { withdrawMembership } from "../../api/member";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyPageNavigationProp } from "../../types/navigation";
import NotificationAlertBox from "../../components/notification/NotificationAlertBox";

export const MyPageScreen = ({
  navigation,
}: {
  navigation: MyPageNavigationProp;
}) => {
  const handleLogout = useLogout();
  const {
    userProfile,
    isLoading: isProfileLoading,
    fetchProfile,
  } = useUserProfile();
  const { participations, isLoading, error, loadParticipations } =
    useParticipations();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] =
    useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);

  const handleWithdrawal = async () => {
    if (!userProfile?.id) {
      alert("사용자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      await withdrawMembership(userProfile.id);
      setIsWithdrawalModalVisible(false);

      await AsyncStorage.multiRemove([
        "pushPermissionShown",
        "notificationSettings",
      ]);

      handleLogout();
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생", error);
    }
  };

  useEffect(() => {
    // 초기 데이터 로드를 순차적으로 실행
    const loadInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Start" }],
          });
          return;
        }

        await fetchProfile(); // 먼저 프로필 데이터 로드
        await loadParticipations(); // 프로필 로드 후 참여 데이터 로드
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    loadInitialData();

    // 이벤트 리스너 등록 (한 번만)
    const matchCreatedListener = () => {
      loadParticipations();
    };

    const matchUpdatedListener = () => {
      loadParticipations();
    };

    matchEventEmitter.addListener("matchCreated", matchCreatedListener);
    matchEventEmitter.addListener("matchUpdated", matchUpdatedListener);

    return () => {
      matchEventEmitter.removeListener("matchCreated", matchCreatedListener);
      matchEventEmitter.removeListener("matchUpdated", matchUpdatedListener);
    };
  }, [fetchProfile, loadParticipations, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <LoggedInHeader />
      <ScrollView nestedScrollEnabled>
        <NotificationAlertBox />
        <View style={styles.header}>
          <Text style={styles.title}>마이페이지</Text>
          <Text style={styles.subtitle}>내 정보와 활동 내역을 관리하세요</Text>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditModalVisible(true)}
              >
                <Edit2 color={colors.white} size={16} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.nickname}>{userProfile?.nickname}</Text>
                  <Text style={styles.email}>{userProfile?.email}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsOptionsModalVisible(true)}
                >
                  <MoreVertical color={colors.white} size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    매너 점수: {userProfile?.mannerScore.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <OptionsModal
            isVisible={isOptionsModalVisible}
            onClose={() => setIsOptionsModalVisible(false)}
            onEditProfile={() => setIsEditModalVisible(true)}
            onLogout={handleLogout}
            onWithdrawal={() => setIsWithdrawalModalVisible(true)}
          />

          {userProfile && (
            <ProfileDetails profile={userProfile} isLoading={isLoading} />
          )}

          <EditProfileModal
            isVisible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
            currentProfile={userProfile}
            onUpdate={fetchProfile}
          />

          <WithdrawalModal
            isVisible={isWithdrawalModalVisible}
            onClose={() => setIsWithdrawalModalVisible(false)}
            onConfirm={handleWithdrawal}
          />
        </View>
        <ParticipationList
          participations={participations}
          onUpdate={loadParticipations}
          navigation={navigation}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
