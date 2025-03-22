import { AxiosError } from "axios";
import { authEventEmitter } from "../event";
import { Router } from "expo-router";
import axiosInstance from "../../api/axios-interceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginParams {
  email: string;
  password: string;
  router: Router;
  onError?: (message: string) => void;
  onSuccess?: () => void;
  shouldNavigate?: boolean;
}

interface LoginResponse {
  jti: string;
  accessToken: string;
  refreshToken: string;
}
export const handleLogin = async ({
  email,
  password,
  router,
  onError,
  onSuccess,
  shouldNavigate = true,
}: LoginParams): Promise<boolean> => {
  try {
    console.log("로그인 시도 중:", email);
    const response = await axiosInstance.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data?.accessToken) {
      console.log("토큰 받음, 저장 시작");

      // 저장 전 체크
      const beforeToken = await AsyncStorage.getItem("accessToken");
      console.log("저장 전 토큰:", beforeToken ? "있음" : "없음");

      // 토큰 저장
      await AsyncStorage.setItem("accessToken", response.data.accessToken);
      await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
      await AsyncStorage.setItem("jti", response.data.jti);
      await AsyncStorage.setItem("isLoggedIn", "true"); // 중요!

      // 저장 후 체크
      const afterToken = await AsyncStorage.getItem("accessToken");
      const isLoggedInValue = await AsyncStorage.getItem("isLoggedIn");
      console.log(
        "저장 후 토큰:",
        afterToken ? afterToken.substring(0, 10) + "..." : "없음"
      );
      console.log("isLoggedIn 값:", isLoggedInValue);

      // 성공 콜백
      if (onSuccess) {
        console.log("성공 콜백 호출");
        onSuccess();
      }

      // // 네비게이션
      // if (shouldNavigate) {
      //   console.log("화면 이동 시도");
      //   router.replace("/(tabs)");
      //   console.log("화면 이동 명령 완료");
      // }
    }
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }

    onError?.("이메일 또는 비밀번호가 올바르지 않습니다.");
    return false;
  }
};
