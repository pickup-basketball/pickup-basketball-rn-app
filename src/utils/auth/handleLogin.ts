import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError, AxiosInstance } from "axios";
import { decodeToken } from "./decodeToken";

interface LoginParams {
  email: string;
  password: string;
  navigation: NavigationProp<any>;
  axiosInstance: AxiosInstance;
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
  navigation,
  axiosInstance,
  onError,
  onSuccess,
  shouldNavigate = true,
}: LoginParams): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data?.accessToken) {
      const decodedToken = decodeToken(response.data.accessToken);
      const userId = decodedToken?.userId;

      await AsyncStorage.multiSet([
        ["jti", response.data.jti],
        ["accessToken", response.data.accessToken],
        ["refreshToken", response.data.refreshToken],
        ["isLoggedIn", "true"],
        ["userId", userId?.toString() ?? ""],
      ]);

      onSuccess?.();

      if (shouldNavigate) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTab" }],
        });
      }

      return true;
    } else {
      console.error("No token in response:", response.data);
      onError?.("로그인 응답에 토큰이 없습니다");
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

    onError?.("이메일 또는 비밀번호가 올바르지 않습니다.");
    return false;
  }
};
