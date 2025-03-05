import axios from "axios";
import axiosInstance from "../../api/axios-interceptor";

type EmailVerificationResult = {
  isValid: boolean;
  message: string;
};

// 이메일 인증 코드 전송
export const sendVerificationCode = async (email: string) => {
  try {
    const response = await axiosInstance.post("/mail/issue-mail", { email });
    return { success: true, message: "인증 코드가 전송되었습니다." };
  } catch (error) {
    console.error("인증 코드 전송 실패:", error);
    return { success: false, message: "인증 코드 전송 실패" };
  }
};

// 이메일 인증 코드 확인
export const verifyEmailCode = async (
  email: string,
  verificationCode: number
) => {
  try {
    const response = await axiosInstance.post("/mail/verify-mail", {
      email,
      verificationCode,
    });
    return { success: true, message: "이메일 인증 성공" };
  } catch (error) {
    console.error("인증 코드 확인 실패:", error);

    // 서버에서 반환하는 에러 메시지 확인
    if (axios.isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message;
      if (serverMessage) {
        return { success: false, message: serverMessage };
      }
    }

    // 기본 에러 메시지
    return { success: false, message: "인증 코드가 올바르지 않습니다." };
  }
};

// 이메일 형식 검증
export const validateEmailFormat = (email: string): EmailVerificationResult => {
  if (!email) {
    return {
      isValid: false,
      message: "이메일을 입력해주세요.",
    };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "유효한 이메일 형식이 아닙니다.",
    };
  }

  return {
    isValid: true,
    message: "",
  };
};

// 이메일 중복 체크
export const checkEmailDuplicate = async (
  email: string
): Promise<EmailVerificationResult> => {
  try {
    const response = await axiosInstance.post("/member/check-email", {
      email: email,
    });

    if (response.data === false) {
      return {
        isValid: false,
        message: "이미 사용 중인 이메일입니다.",
      };
    } else {
      return {
        isValid: true,
        message: "사용 가능한 이메일입니다.",
      };
    }
  } catch (error) {
    console.error("이메일 중복 확인 실패:", error);

    if (axios.isAxiosError(error)) {
      // 네트워크 또는 서버 관련 오류 처리
      if (error.code === "ECONNABORTED") {
        return {
          isValid: false,
          message: "요청 시간이 초과되었습니다. 다시 시도해 주세요.",
        };
      } else if (!error.response) {
        return {
          isValid: false,
          message: "서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.",
        };
      } else {
        // 서버에서 오는 다양한 상태 코드에 따른 처리
        const statusCode = error.response.status;

        switch (statusCode) {
          case 400:
            return {
              isValid: false,
              message: "잘못된 요청입니다. 이메일 형식을 확인해 주세요.",
            };
          case 429:
            return {
              isValid: false,
              message:
                "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해 주세요.",
            };
          case 500:
          default:
            return {
              isValid: false,
              message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
            };
        }
      }
    }

    return {
      isValid: false,
      message: "이메일 확인 중 오류가 발생했습니다.",
    };
  }
};
