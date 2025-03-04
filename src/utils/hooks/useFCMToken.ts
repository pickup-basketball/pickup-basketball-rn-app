import messaging from "@react-native-firebase/messaging";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axios-interceptor";
import { getCurrentUserId } from "../auth";
import { Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";

// FCM 토큰 관리를 위한 타입 정의
type DeviceInfo = {
  fcmToken: string;
  memberId?: number;
  deviceType: "IOS" | "ANDROID";
  status: boolean;
};

type DeviceUpdateInfo = {
  deviceId: number;
  status: boolean;
};

type FCMTokenManagerReturn = {
  fcmToken: string | null;
  saveFcmTokenToServer: (token: string) => Promise<void>;
  updateDeviceStatus: (deviceId: number, status: boolean) => Promise<void>;
  deleteFcmToken: () => Promise<void>;
};

const FCMTokenManager = (): FCMTokenManagerReturn => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<number | null>(null);

  useEffect(() => {
    // Firebase 초기화 확인
    try {
      getApp(); // 최신 방식으로 앱 확인
      // 초기화된 경우에만 FCM 토큰을 가져옴
      getFcmToken();

      // 토큰 갱신 이벤트 리스너
      const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
        console.log("FCM 토큰 갱신:", newToken);
        setFcmToken(newToken);
        await saveFcmTokenToServer(newToken);
      });

      return unsubscribe;
    } catch (error) {
      console.log(
        "Firebase가 초기화되지 않았습니다. 메시징 기능을 사용할 수 없습니다.",
        error
      );
    }
  }, []);

  // FCM 토큰 가져오기
  const getFcmToken = async (): Promise<string | null> => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log("FCM 토큰:", token);
      return token;
    } catch (error) {
      console.error("FCM 토큰 가져오기 실패:", error);
      return null;
    }
  };

  // 서버에 FCM 토큰 저장
  const saveFcmTokenToServer = async (token: string): Promise<void> => {
    try {
      // memberId 가져오기
      const memberId = await getMemberId();

      // 기기 타입 확인
      const deviceType = getDeviceType();

      const deviceInfo: DeviceInfo = {
        fcmToken: token,
        memberId: memberId,
        deviceType: deviceType,
        status: true,
      };

      const response = await axiosInstance.post("/device", deviceInfo);

      // 응답에서 deviceId 저장 (API가 이를 반환한다고 가정)
      if (response.data && response.data.deviceId) {
        setDeviceId(response.data.deviceId);
      }

      console.log("토큰 저장 결과:", response.data);
    } catch (error) {
      console.error("FCM 토큰 저장 실패:", error);
    }
  };

  // 디바이스 상태 업데이트 (스웨거 PUT API 기준)
  const updateDeviceStatus = async (
    deviceId: number,
    status: boolean
  ): Promise<void> => {
    try {
      const updateInfo: DeviceUpdateInfo = {
        deviceId: deviceId,
        status: status,
      };

      const response = await axiosInstance.put("/device", updateInfo);

      console.log("디바이스 상태 업데이트 결과:", response.data);
    } catch (error) {
      console.error("디바이스 상태 업데이트 실패:", error);
    }
  };

  // FCM 토큰 삭제
  const deleteFcmToken = async (): Promise<void> => {
    if (!fcmToken) {
      console.warn("삭제할 FCM 토큰이 없습니다.");
      return;
    }

    try {
      // 서버에서 디바이스 정보 삭제
      const response = await axiosInstance.delete("/device", {
        data: {
          fcmToken: fcmToken,
        },
      });

      console.log("토큰 삭제 결과:", response.data);

      // 기기에서 토큰 삭제
      await messaging().deleteToken();
      setFcmToken(null);
      setDeviceId(null);
    } catch (error) {
      console.error("FCM 토큰 삭제 실패:", error);
    }
  };

  return {
    fcmToken,
    saveFcmTokenToServer,
    updateDeviceStatus,
    deleteFcmToken,
  };
};

const getMemberId = async (): Promise<number> => {
  const userId = await getCurrentUserId();
  return userId ?? 0; // null이면 0 반환 또는 다른 기본값
};

const getDeviceType = (): "IOS" | "ANDROID" => {
  return Platform.OS === "ios" ? "IOS" : "ANDROID";
};

export default FCMTokenManager;
