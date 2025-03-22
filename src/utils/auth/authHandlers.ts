import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeToken } from "./decodeToken";
import { Router } from "expo-router";
import EventEmitter from "eventemitter3";

export const authEventEmitter = new EventEmitter();

type TLoginEventData = {
  accessToken: string;
  refreshToken: string;
  jti: string;
  router: Router;
  shouldNavigate?: boolean;
  callback?: () => void;
};

// 로그인 이벤트 핸들러 등록
export const setupAuthHandlers = () => {
  authEventEmitter.addListener("login", handleLoginEvent);

  return () => {
    authEventEmitter.removeListener("login", handleLoginEvent);
  };
};

// 로그인 이벤트 처리 함수
const handleLoginEvent = async (data: TLoginEventData) => {
  try {
    const {
      accessToken,
      refreshToken,
      jti,
      router,
      shouldNavigate = true,
      callback,
    } = data;

    // 토큰 디코딩
    const decodedToken = decodeToken(accessToken);
    const userId = decodedToken?.userId;

    // AsyncStorage에 데이터 저장
    await AsyncStorage.multiSet([
      ["jti", jti],
      ["accessToken", accessToken],
      ["refreshToken", refreshToken],
      ["isLoggedIn", "true"],
      ["userId", userId?.toString() ?? ""],
    ]);

    // 콜백 실행
    if (callback) {
      callback();
    }

    // 네비게이션 처리
    if (shouldNavigate && router) {
      router.replace("(tabs)/index");
    }
  } catch (error) {
    console.error("로그인 처리 실패:", error);
  }
};
