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

const refreshTokenRequest = axios.create({
  baseURL: "http://13.125.58.70:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // 로그인, 회원가입 요청일 경우 토큰 체크를 하지 않음
    if (config.url === "/auth/login" || config.url === "/auth/signup") {
      return config;
    }

    const token = await AsyncStorage.getItem("accessToken");
    // 토큰 없으면 Login으로 이동시킴
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
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청일 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refreshToken으로 새 accessToken 발급
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const response = await refreshTokenRequest.post("/auth/refresh", {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        await AsyncStorage.setItem("accessToken", newAccessToken);

        // 새 토큰으로 원래 요청 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 만료된 경우
        await AsyncStorage.multiRemove([
          "accessToken",
          "refreshToken",
          "isLoggedIn",
        ]);
        // 로그인 화면으로 이동하는 로직은 App.tsx의 isLoggedIn 상태 변화로 처리됨
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
