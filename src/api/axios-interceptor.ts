import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate, navigationRef } from "../navigation/NavigationService";
import { Alert } from "react-native";
import { CommonActions } from "@react-navigation/native";

const axiosInstance = axios.create({
  baseURL: "http://13.125.58.70:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshAxios = axios.create({
  baseURL: "http://13.125.58.70:8080",
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 500 &&
      error.response?.data?.message?.includes("JWT expired") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        console.log("Attempting refresh with token:", refreshToken);

        const response = await refreshAxios.post("/auth/refresh", null, {
          headers: { refreshToken },
        });

        console.log("Refresh response:", response.data);

        const {
          accessToken,
          refreshToken: newRefreshToken,
          jti,
        } = response.data;
        await AsyncStorage.multiSet([
          ["accessToken", accessToken],
          ["refreshToken", newRefreshToken],
          ["jti", jti],
        ]);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("Refresh Error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });
        } else {
          console.log("Non-Axios Error:", error);
        }

        console.log("토큰 갱신 실패, 로그아웃 처리...");
        await AsyncStorage.multiRemove([
          "jti",
          "accessToken",
          "refreshToken",
          "isLoggedIn",
        ]);

        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );

        Alert.alert(
          "세션 만료",
          "로그인이 만료되었습니다. 다시 로그인해주세요."
        );
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
