import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigation/NavigationService";

const axiosInstance = axios.create({
  baseURL: "http://13.125.58.70:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // 로그인, 회원가입, 토큰 리프레시 요청은 제외
    if (
      config.url === "/auth/login" ||
      config.url === "/auth/signup" ||
      config.url === "/auth/refresh"
    ) {
      return config;
    }

    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      console.warn("No access token found. Redirecting to login.");
      navigate("Login");
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청일 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken을 body에 담아 새 토큰 요청
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const response = await axios.post(
          "http://13.125.58.70:8080/auth/refresh",
          { refreshToken } // refreshToken을 body에 담아 전송
        );

        // 새 토큰 저장
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await AsyncStorage.multiSet([
          ["accessToken", accessToken],
          ["refreshToken", newRefreshToken],
        ]);

        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 만료된 경우
        await AsyncStorage.multiRemove([
          "jti",
          "accessToken",
          "refreshToken",
          "isLoggedIn",
        ]);
        navigate("Login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
