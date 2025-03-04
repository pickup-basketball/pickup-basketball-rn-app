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
import * as Device from "expo-device";
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
    if (isVisible) {
      checkNotificationStatus();
    }
  }, [isVisible]);

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
      console.error("알림 상태 확인 실패:", error);
    }
  };

  // FCM 토큰 얻기
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("알림 권한 필요", "알림을 받으려면 권한이 필요합니다");
        return null;
      }

      // 실제 디바이스에서는 expo-notifications을 통해 FCM 토큰 얻기
      let rawToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId: EXPO_PROJECT_ID,
        })
      ).data;

      // ExponentPushToken[xxx] 형식에서 xxx 부분만 추출
      token = rawToken.replace("ExponentPushToken[", "").replace("]", "");
      console.log("추출된 FCM 토큰:", token);
    } else {
      // 에뮬레이터용 테스트 코드 - 개발 중에만 사용
      console.log("에뮬레이터에서 테스트 중: 가짜 토큰 사용");
      // 에뮬레이터에서는 임시 토큰 생성 (개발용)
      const deviceId = `emulator-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
      token = deviceId; // 대괄호와 ExponentPushToken 접두사 제거
      console.log("생성된 가짜 토큰:", token);
    }

    return token;
  };

  const toggleNotifications = async () => {
    try {
      if (!isEnabled) {
        // 권한 요청 및 토큰 얻기
        const token = await registerForPushNotificationsAsync();
        if (!token) return;

        try {
          // FCM 토큰 서버에 등록
          await axiosInstance.post("/device", {
            fcmToken: token,
            deviceType: Platform.OS.toUpperCase(),
            status: true, // status 필드 추가
          });

          await AsyncStorage.setItem("notificationSettings", "true");
          setIsEnabled(true);
        } catch (error: any) {
          // 409 에러는 이미 토큰이 등록된 상태
          if (error.response?.status === 409) {
            await AsyncStorage.setItem("notificationSettings", "true");
            setIsEnabled(true);
          } else {
            console.error(
              "서버에 알림 토큰 등록 실패:",
              error.response?.data || error
            );
            throw error;
          }
        }
      } else {
        // 토큰 얻기
        const token = await registerForPushNotificationsAsync();
        if (!token) return;

        try {
          // 서버에서 토큰 삭제
          await axiosInstance.delete("/device", {
            data: { fcmToken: token },
          });

          await AsyncStorage.setItem("notificationSettings", "false");
          setIsEnabled(false);
        } catch (error: any) {
          if (error.response?.status === 404) {
            await AsyncStorage.setItem("notificationSettings", "false");
            setIsEnabled(false);
          } else {
            console.error(
              "서버에서 알림 토큰 삭제 실패:",
              error.response?.data || error
            );
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("알림 설정 변경 실패:", error);
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
