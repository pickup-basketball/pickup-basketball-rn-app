import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosInstance } from "axios";

interface LoginParams {
  email: string;
  password: string;
  rememberLogin?: boolean;
  navigation: NavigationProp<any>;
  axiosInstance: AxiosInstance;
  onError?: (message: string) => void;
  onSuccess?: () => void;
  defaultRoute?: {
    name: string;
    params?: Record<string, any>;
  };
}

interface LoginResponse {
  jti: string;
  accessToken: string;
  refreshToken: string;
}

export const handleLogin = async ({
  email,
  password,
  rememberLogin = false,
  navigation,
  axiosInstance,
  onError,
  onSuccess,
  defaultRoute = { name: "MainTab", params: { screen: "guide" } },
}: LoginParams): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data?.accessToken) {
      await AsyncStorage.multiSet([
        ["jti", response.data.jti],
        ["accessToken", response.data.accessToken],
        ["refreshToken", response.data.refreshToken],
        ["isLoggedIn", "true"],
        ["rememberLogin", rememberLogin ? "true" : "false"],
      ]);

      // 잠시 대기하여 AsyncStorage가 완전히 저장되도록 함
      await new Promise((resolve) => setTimeout(resolve, 100));

      onSuccess?.();

      navigation.reset({
        index: 0,
        routes: [defaultRoute],
      });

      return true;
    } else {
      console.error("No token in response:", response.data);
      const errorMessage = "로그인 응답에 토큰이 없습니다";
      onError?.(errorMessage);
      return false;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Error details:", {
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });
    }

    const errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
    onError?.(errorMessage);
    return false;
  }
};
