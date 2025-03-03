import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigation/NavigationService";
import { authEventEmitter } from "../utils/event";

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
  headers: {
    "Content-Type": "application/json",
  },
});

// 모든 요청에 디버깅 추가
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("🚀 요청 시작:", config.method?.toUpperCase(), config.url);
    console.log("📦 요청 데이터:", config.data);
    console.log("🔧 요청 헤더:", config.headers);

    if (
      config.url === "/auth/login" ||
      config.url === "/auth/signup" ||
      config.url === "/auth/refresh"
    ) {
      return config;
    }

    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      console.warn("⚠️ 토큰 없음: 로그인 화면으로 이동합니다.");
      navigate("Login");
    } else {
      console.log("🔑 인증 토큰 사용:", token.substring(0, 15) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ 요청 오류:", error.message);
    return Promise.reject(error);
  }
);

// 모든 응답에 디버깅 추가
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ 응답 성공:", response.status);
    console.log("📄 응답 데이터:", response.data);
    return response;
  },
  async (error) => {
    console.error("❌ 응답 오류:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
    });

    const originalRequest = error.config;

    if (
      error.response?.status === 401 ||
      (error.response?.status === 400 &&
        error.response?.data?.message?.includes("토큰이 만료") &&
        !originalRequest._retry)
    ) {
      console.log("🔄 토큰 만료 감지: 토큰 갱신 시도...");
      // 한 번만 재시도
      if (originalRequest._retry) {
        console.log("⚠️ 이미 재시도한 요청입니다. 로그아웃 처리합니다.");
        authEventEmitter.emit(
          "logout",
          "세션이 만료되었습니다. 다시 로그인해주세요."
        );
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error("❌ 리프레시 토큰 없음");
          authEventEmitter.emit(
            "logout",
            "세션이 만료되었습니다. 다시 로그인해주세요."
          );
          return Promise.reject(error);
        }

        console.log("🔑 리프레시 토큰:", refreshToken.substring(0, 10) + "...");

        const refreshResponse = await refreshAxios.post("/auth/refresh", "", {
          headers: {
            "Refresh-Token": refreshToken,
          },
        });

        console.log("✅ 토큰 갱신 성공:", {
          newTokenLength: refreshResponse.data.accessToken?.length,
          refreshTokenLength: refreshResponse.data.refreshToken?.length,
        });

        const {
          accessToken,
          refreshToken: newRefreshToken,
          jti,
        } = refreshResponse.data;

        // 새 토큰 저장
        authEventEmitter.emit("login", {
          accessToken,
          refreshToken: newRefreshToken,
          jti: jti || "",
          shouldNavigate: false,
        });
        console.log("💾 새 토큰 저장됨");

        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔄 원래 요청 재시도:", originalRequest.url);
        return axiosInstance(originalRequest);
      } catch (error) {
        console.error("❌ 토큰 갱신 실패:");
        if (axios.isAxiosError(error)) {
          console.error("  - 상태:", error.response?.status);
          console.error("  - 데이터:", error.response?.data);
          console.error("  - 메시지:", error.message);
        } else {
          console.error("  - 일반 오류:", error);
        }

        authEventEmitter.emit(
          "logout",
          "세션이 만료되었습니다. 다시 로그인해주세요."
        );

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// 리프레시 인스턴스에도 로깅 추가
refreshAxios.interceptors.request.use(
  (config) => {
    console.log("🔄 리프레시 요청:", config.url);
    console.log("🔧 리프레시 헤더:", config.headers);
    return config;
  },
  (error) => {
    console.error("❌ 리프레시 요청 오류:", error.message);
    return Promise.reject(error);
  }
);

refreshAxios.interceptors.response.use(
  (response) => {
    console.log("✅ 리프레시 응답 성공:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ 리프레시 응답 오류:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
