import EventEmitter from "eventemitter3";
export const matchEventEmitter = new EventEmitter();
export const authEventEmitter = new EventEmitter();

// 로그인 이벤트 데이터 타입 정의
export interface LoginEventData {
  accessToken: string;
  refreshToken: string;
  jti: string;
  navigation?: any;
  shouldNavigate?: boolean;
  callback?: () => void;
}
