import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { LogoutHandler } from "../src/components/common/LogoutHandler";
import FCMTokenManager from "../src/utils/hooks/useFCMToken";
import { initializeApp, getApps } from "@react-native-firebase/app";
import { createContext } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

// 앱 컴포넌트 외부에서 Firebase 초기화
try {
  if (getApps().length === 0) {
    initializeApp({
      appId: "placeholder-app-id",
      apiKey: "placeholder-api-key",
      projectId: "placeholder-project-id",
    });
    console.log("Firebase 초기화 성공");
  } else {
    console.log("Firebase 이미 초기화됨");
  }
} catch (error) {
  console.error("Firebase 초기화 실패:", error);
}

// 인증 관련 컨텍스트 타입 정의
type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

// 인증 컨텍스트 생성
export const AuthContext = createContext<AuthContextType | null>(null);

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { fcmToken, saveFcmTokenToServer } = FCMTokenManager();
  const segments = useSegments();
  const router = useRouter();

  // 라우팅 상태 추적을 위한 ref
  const hasNavigated = useRef(false);

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const [loginStatus, accessToken, refreshToken] =
          await AsyncStorage.multiGet([
            "isLoggedIn",
            "accessToken",
            "refreshToken",
          ]);
        console.log("loginStatus:", loginStatus);
        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);

        // 로그인 상태 설정
        const isLoggedInValue =
          loginStatus[1] === "true" && Boolean(accessToken[1]);
        setIsLoggedIn(isLoggedInValue);

        // FCM 토큰 처리
        if (isLoggedInValue && fcmToken && !fcmToken.startsWith("simulator-")) {
          await saveFcmTokenToServer(fcmToken);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [fcmToken]);

  // 별도의 라우팅 처리 useEffect
  useEffect(() => {
    // 로딩 중이면 아무것도 하지 않음
    if (isLoading) return;

    // 라우팅 처리 로직을 진행
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";
    const isNotFound = segments[0] === "+not-found";

    console.log("라우팅 상태 확인:", {
      isLoggedIn,
      hasNavigated: hasNavigated.current,
      segments,
    });

    // 이미 라우팅되었다면 무시
    if (hasNavigated.current) return;

    // +not-found이거나 루트 경로이면 리디렉션
    // @ts-ignore
    if (isNotFound || segments.length === 0) {
      hasNavigated.current = true;

      if (isLoggedIn) {
        console.log("로그인 상태 - 홈으로 이동");
        router.replace("/(tabs)");
      } else {
        console.log("로그아웃 상태 - 시작 화면으로 이동");
        router.replace("/(auth)/start");
      }
    }
    // 로그인 상태인데 인증 그룹에 있으면 탭으로 이동
    else if (isLoggedIn && inAuthGroup) {
      hasNavigated.current = true;
      console.log("로그인 상태인데 인증 화면 - 홈으로 이동");
      router.replace("/(tabs)");
    }
    // 로그아웃 상태인데 탭 그룹에 있으면 시작 화면으로 이동
    else if (!isLoggedIn && inTabsGroup) {
      hasNavigated.current = true;
      console.log("로그아웃 상태인데 탭 화면 - 시작 화면으로 이동");
      router.replace("/(auth)/start");
    }
  }, [isLoading, isLoggedIn, segments]);

  useEffect(() => {
    console.log("isLoggedIn 상태 변경됨:", isLoggedIn);
  }, [isLoggedIn]);

  // 세그먼트가 변경될 때마다 hasNavigated 초기화
  useEffect(() => {
    // 로그인/로그아웃 상태 변경 이후에만 라우팅 상태 초기화
    hasNavigated.current = false;
  }, [segments]);

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <LogoutHandler />
        <Slot />
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
