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
import AsyncStorage from "@react-native-async-storage/async-storage";
import FCMTokenManager from "../../utils/hooks/useFCMToken";

type TNotificationSettingsModal = {
  isVisible: boolean;
  onClose: () => void;
};

const NotificationSettingsModal = ({
  isVisible,
  onClose,
}: TNotificationSettingsModal) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const { fcmToken, saveFcmTokenToServer, deleteFcmToken } = FCMTokenManager();

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

      // FCM 토큰이 있는지 확인하고 상태 설정
      setIsEnabled(status === "granted" && savedEnabled && !!fcmToken);
    } catch (error) {
      console.error("알림 상태 확인 실패:", error);
    }
  };

  const requestNotificationPermission = async () => {
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
        return false;
      }
      return true;
    } else {
      console.log("에뮬레이터에서는 알림 기능이 제한됩니다");
      return true; // 에뮬레이터에서는 true 반환
    }
  };

  const toggleNotifications = async () => {
    try {
      if (!isEnabled) {
        // 권한 요청
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted) return;

        // 시뮬레이터인 경우 가짜 토큰으로 처리
        if (!Device.isDevice) {
          console.log("시뮬레이터에서 알림 설정 테스트 모드 활성화");
          await AsyncStorage.setItem("notificationSettings", "true");
          setIsEnabled(true);
          return;
        }

        // 실제 기기에서의 처리
        if (!fcmToken) {
          console.log("FCM 토큰을 획득하는 중...");
        }

        if (fcmToken) {
          await saveFcmTokenToServer(fcmToken);
          await AsyncStorage.setItem("notificationSettings", "true");
          setIsEnabled(true);
        } else {
          throw new Error("FCM 토큰을 획득할 수 없습니다");
        }
      } else {
        // 알림 비활성화
        if (!Device.isDevice) {
          console.log("시뮬레이터에서 알림 설정 테스트 모드 비활성화");
          await AsyncStorage.setItem("notificationSettings", "false");
          setIsEnabled(false);
          return;
        }

        await deleteFcmToken();
        await AsyncStorage.setItem("notificationSettings", "false");
        setIsEnabled(false);
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
