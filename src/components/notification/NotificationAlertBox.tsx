import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bell } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../styles/colors";
import PushPermissionModal from "../permission/PushPermissionModal";

const NotificationAlertBox = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    checkNotificationSettings();
  }, []);

  const checkNotificationSettings = async () => {
    try {
      const notificationSettings = await AsyncStorage.getItem(
        "notificationSettings"
      );
      setShowAlert(notificationSettings === "false");
    } catch (error) {
      console.error("알림 설정 확인 중 오류:", error);
    }
  };

  const handleRequestPermission = () => {
    setShowPermissionModal(true);
  };

  const handlePermissionModalClose = () => {
    setShowPermissionModal(false);
    // 모달이 닫힌 후 설정이 변경되었을 수 있으므로 상태 다시 확인
    checkNotificationSettings();
  };

  if (!showAlert) return null;

  return (
    <>
      <View style={styles.container}>
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

      <PushPermissionModal
        isVisible={showPermissionModal}
        onClose={handlePermissionModalClose}
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
