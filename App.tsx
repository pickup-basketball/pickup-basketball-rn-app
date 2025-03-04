import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { MainTabNavigator } from "./src/navigation/MainTabNavigator";
import { RootStackParamList } from "./src/types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StartScreen from "./src/screens/auth/StartScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignupScreen from "./src/screens/auth/SignupScreen";
import { setupAuthHandlers } from "./src/utils/auth/authHandlers";
import { LogoutHandler } from "./src/components/common/LogoutHandler";
import FCMTokenManager from "./src/utils/hooks/useFCMToken";
import { initializeApp, getApps, getApp } from "@react-native-firebase/app";

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

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { fcmToken, saveFcmTokenToServer } = FCMTokenManager();

  useEffect(() => {
    const cleanupHandlers = setupAuthHandlers();
    return cleanupHandlers;
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const [loginStatus, accessToken, refreshToken] =
          await AsyncStorage.multiGet([
            "isLoggedIn",
            "accessToken",
            "refreshToken",
          ]);
        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);
        if (loginStatus[1] === "true" && accessToken[1]) {
          setIsLoggedIn(true);

          // 로그인 상태일 때 FCM 토큰을 서버에 저장
          if (fcmToken) {
            await saveFcmTokenToServer(fcmToken);
          }
        } else {
          await AsyncStorage.multiRemove([
            "isLoggedIn",
            "accessToken",
            "refreshToken",
            "jti",
          ]);
          setIsLoggedIn(false);
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

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <LogoutHandler />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isLoggedIn ? "MainTab" : "Start"}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTab" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
