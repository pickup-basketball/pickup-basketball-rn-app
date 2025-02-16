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
}

interface LoginResponse {
  jti: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}
export const handleLogin = async ({
  email,
  password,
  navigation,
  axiosInstance,
  onError,
  onSuccess,
}: LoginParams): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    if (response.data?.accessToken) {
      console.log("response", JSON.stringify(response, null, 2));
      await AsyncStorage.multiSet([
        ["jti", response.data.jti],
        ["accessToken", response.data.accessToken],
        ["refreshToken", response.data.refreshToken],
        ["isLoggedIn", "true"],
        ["userId", response.data.userId.toString()],
      ]);

      onSuccess?.();

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTab" }],
      });

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
