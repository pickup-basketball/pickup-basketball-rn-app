// NotificationAlertBox.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
} from "react-native";
import { Bell } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../styles/colors";
import NotificationSettingsModal from "../notification/NotificationSettingsModal";

const NotificationAlertBox = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // AppState 모니터링 추가
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkNotificationSettings();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 초기 마운트와 설정 변경 시 체크
  useEffect(() => {
    checkNotificationSettings();
  }, []);

  // 주기적으로 설정 확인 (1초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      checkNotificationSettings();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const checkNotificationSettings = async () => {
    try {
      const notificationSettings = await AsyncStorage.getItem(
        "notificationSettings"
      );
      setShowAlert(notificationSettings !== "true");
    } catch (error) {
      console.error("알림 설정 확인 중 오류:", error);
    }
  };

  const handleRequestPermission = () => {
    setShowSettingsModal(true);
  };

  const handleSettingsModalClose = () => {
    setShowSettingsModal(false);
    // 모달이 닫힌 후에도 설정 다시 확인
    checkNotificationSettings();
  };

  if (!showAlert) return null;

  return (
    <>
      <View style={styles.container}>
        {/* 기존 코드 */}
        <View style={styles.iconContainer}>
          <Bell size={20} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>매치 알림을 받아보세요</Text>
          <Text style={styles.description}>
            매치 확정, 참여 수락 등 중요 알림을 받지 못하고 있습니다.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRequestPermission}
        >
          <Text style={styles.buttonText}>설정</Text>
        </TouchableOpacity>
      </View>

      <NotificationSettingsModal
        isVisible={showSettingsModal}
        onClose={handleSettingsModalClose}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey.dark,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.grey.medium,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 0, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.grey.light,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NotificationAlertBox;
