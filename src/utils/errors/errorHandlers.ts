// utils/errorHandlers.ts
import { Alert } from "react-native";
import axios from "axios";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type SetErrorsFunction = (errors: { [key: string]: string }) => void;

export const handleMatchSubmitError = (
  error: unknown,
  setErrors: SetErrorsFunction,
  action: "생성" | "수정" = "생성"
) => {
  if (axios.isAxiosError(error)) {
    console.error(
      "Error details:",
      JSON.stringify(
        {
          status: error.response?.status,
          message: error.response?.data?.message,
          data: error.response?.data,
        },
        null,
        2
      )
    );
  }
  console.error(`Error ${action} match:`, error);

  let errorMessage = `매치 ${action} 중 오류가 발생했습니다`;

  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.message) {
      errorMessage = apiError.response.data.message;
    }
  }

  setErrors({ submit: errorMessage });
  Alert.alert("오류", errorMessage);
};
