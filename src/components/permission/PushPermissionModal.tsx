import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Platform,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { colors } from "../../styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EXPO_PROJECT_ID } from "../../config/expo";
import FCMTokenManager from "../../utils/hooks/useFCMToken";

type PushPermissionModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const PushPermissionModal = ({
  isVisible,
  onClose,
}: PushPermissionModalProps) => {
  const { saveFcmTokenToServer } = FCMTokenManager();

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

  const requestPermission = async () => {
    try {
      // 토큰 얻기
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        onClose();
        return;
      }

      try {
        // FCMTokenManager를 사용하여 서버에 토큰 저장
        await saveFcmTokenToServer(token);

        // AsyncStorage에 푸시 알림 설정 상태 저장
        await AsyncStorage.setItem("pushPermissionShown", "true");
        await AsyncStorage.setItem("notificationSettings", "true");

        console.log("알림 토큰 등록 성공:", token);
      } catch (error: any) {
        console.error("알림 토큰 등록 실패:", error.response?.data || error);
        if (error.response?.status === 409) {
          await AsyncStorage.setItem("pushPermissionShown", "true");
          await AsyncStorage.setItem("notificationSettings", "true");
        }
      }
    } catch (error) {
      console.error("푸시 알림 권한 요청 실패:", error);
    } finally {
      onClose();
    }
  };

  const skipPermission = async () => {
    try {
      await AsyncStorage.setItem("pushPermissionShown", "true");
      await AsyncStorage.setItem("notificationSettings", "false");
    } catch (error) {
      console.error("푸시 알림 설정 저장 실패:", error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>더 나은 매치 경험을 위해</Text>
          <Text style={styles.description}>
            <Text style={styles.pointText}>매치 확정, 변경 </Text>
            <Text>
              등 중요한 알림을 받아보세요.
              {"\n"}
              나중에 설정에서 변경할 수 있습니다.
            </Text>
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={skipPermission}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryButtonText}>나중에 하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={requestPermission}
              style={[styles.button, styles.primaryButton]}
            >
              <Text style={styles.primaryButtonText}>알림 허용하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  pointText: {
    fontWeight: "700",
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: "#F2F2F2",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PushPermissionModal;
