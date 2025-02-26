import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

const sendTokenToServer = (token: string) => {
  return token;
};

export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 권한이 없으면 요청
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 권한이 거부된 경우
    if (finalStatus !== "granted") {
      Alert.alert("알림 권한이 필요합니다");
      return;
    }

    // 토큰 얻기
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo push token:", token);

    // 토큰을 서버에 전송
    await sendTokenToServer(token);
  } catch (error) {
    console.error("알림 권한 요청 실패:", error);
  }
};
