import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";

import { colors } from "../../styles/colors";
import axiosInstance from "../../api/axios-interceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PushPermissionModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PushPermissionModal = ({
  isVisible,
  onClose,
}: PushPermissionModalProps) => {
  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        const token = (await Notifications.getExpoPushTokenAsync()).data;

        // FCM 토큰을 서버에 등록
        await axiosInstance.post("/device", {
          fcmToken: token,
          deviceType: Platform.OS.toUpperCase(), // "IOS" 또는 "ANDROID"
        });

        // AsyncStorage에 푸시 알림 설정 상태 저장
        await AsyncStorage.setItem("pushPermissionShown", "true");
      }
    } catch (error) {
      console.error("Failed to register device:", error);
    } finally {
      onClose();
    }
  };

  const skipPermission = () => {
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="fade">
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
