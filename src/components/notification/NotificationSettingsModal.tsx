import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import { colors } from "../../styles/colors";
import axiosInstance from "../../api/axios-interceptor";
import { EXPO_PROJECT_ID } from "../../config/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TNotificationSettingsModal = {
  isVisible: boolean;
  onClose: () => void;
};

const NotificationSettingsModal = ({
  isVisible,
  onClose,
}: TNotificationSettingsModal) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      // 시스템 권한 확인
      const { status } = await Notifications.getPermissionsAsync();

      // AsyncStorage에서 저장된 설정 가져오기
      const savedSettings = await AsyncStorage.getItem("notificationSettings");
      const savedEnabled = savedSettings === "true";

      // 시스템 권한과 저장된 설정이 모두 허용일 때만 true
      setIsEnabled(status === "granted" && savedEnabled);
    } catch (error) {
      console.error("Failed to check notification status:", error);
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!isEnabled) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          const token = (
            await Notifications.getExpoPushTokenAsync({
              projectId: EXPO_PROJECT_ID,
            })
          ).data;

          try {
            await axiosInstance.post("/device", {
              fcmToken: token,
              deviceType: Platform.OS.toUpperCase(),
            });

            await AsyncStorage.setItem("notificationSettings", "true");
            setIsEnabled(true);
          } catch (error: any) {
            // 409 에러는 이미 토큰이 등록된 상태
            if (error.response?.status === 409) {
              // 이미 등록된 상태라면 활성화 상태로 간주
              await AsyncStorage.setItem("notificationSettings", "true");
              setIsEnabled(true);
            } else {
              throw error; // 다른 에러는 상위로 전파
            }
          }
        }
      } else {
        const token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: EXPO_PROJECT_ID,
          })
        ).data;

        try {
          await axiosInstance.delete("/device", {
            data: { fcmToken: token },
          });

          await AsyncStorage.setItem("notificationSettings", "false");
          setIsEnabled(false);
        } catch (error: any) {
          // 404 에러는 이미 토큰이 없는 상태
          if (error.response?.status === 404) {
            await AsyncStorage.setItem("notificationSettings", "false");
            setIsEnabled(false);
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Failed to toggle notifications:", error);
      // 사용자에게 에러 알림
      Alert.alert(
        "알림 설정 실패",
        "알림 설정을 변경하는데 실패했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>알림 설정</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>매치 알림</Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor={isEnabled ? "#ffffff" : "#f4f3f4"}
              onValueChange={toggleNotifications}
              value={isEnabled}
            />
          </View>
          <Text style={styles.description}>
            매치 확정, 변경 등 중요한 알림을 받아보세요
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 20,
    textAlign: "center",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    color: colors.white,
  },
  description: {
    fontSize: 14,
    color: colors.grey.light,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default NotificationSettingsModal;
