import { useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { WriteScreenNavigationProp } from "../../types/navigation";
import { TFormData } from "../validators/types";
import axiosInstance from "../../api/axios-interceptor";
import { matchEventEmitter } from "../event";

export const useMatchSubmit = (
  navigation: WriteScreenNavigationProp,
  validateForm: (data: TFormData) => {
    isValid: boolean;
    errors: { [key: string]: string };
  }
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmitError = (error: unknown) => {
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
    console.error("Error creating match:", error);

    interface ApiError {
      response?: {
        data?: {
          message?: string;
        };
      };
    }

    let errorMessage = "매치 생성 중 오류가 발생했습니다";

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      }
    }

    setErrors({ submit: errorMessage });
    Alert.alert("오류", errorMessage);
  };

  const handleSubmit = async (formData: TFormData) => {
    console.log("📍 handleSubmit started with formData:", formData);

    try {
      const { isValid, errors: validationErrors } = validateForm(formData);

      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      const safeTrim = (value: string | undefined): string => {
        console.log("💫 safeTrim input:", value, "type:", typeof value);
        if (value === undefined) return "";
        if (typeof value !== "string") return String(value);
        return value.trim();
      };

      // 각 필드 변환 전 로깅
      console.log("🔍 Converting fields:", {
        title: formData.title,
        description: formData.description,
        courtName: formData.courtName,
        district: formData.district,
        locationDetail: formData.locationDetail,
      });

      // payload 생성 전 date와 time 체크
      console.log("📅 Date and Time:", {
        date: formData.date,
        time: formData.time,
        dateType: typeof formData.date,
        timeType: typeof formData.time,
      });

      const payload = {
        title: safeTrim(formData.title),
        description: safeTrim(formData.description),
        courtName: safeTrim(formData.courtName),
        district: safeTrim(formData.district),
        locationDetail: safeTrim(formData.locationDetail),
        date: formData.date,
        time: formData.time,
        level: formData.level || "BEGINNER",
        currentPlayers: 0,
        maxPlayers: formData.maxPlayers || 6,
        hostId: 0,
        cost: Number(formData.cost) || 0,
        rules: Array.isArray(formData.rules)
          ? formData.rules
              .filter((rule) => rule && typeof rule === "string")
              .map((rule) => rule.trim())
              .filter((rule) => rule !== "")
              .join(",")
          : "",
        status: "OPEN",
      };

      console.log("📦 Created payload:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post("/matches", payload);

      if (response.status === 201 || response.status === 200) {
        matchEventEmitter.emit("matchCreated");
        Alert.alert("성공", "매치가 성공적으로 생성되었습니다", [
          { text: "확인", onPress: () => navigation.navigate("MatchingMain") },
        ]);
      }
    } catch (error) {
      console.log("💥 Error occurred:", error);
      // 에러 발생 시 현재 스택 트레이스 출력
      console.log(
        "🔍 Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );
      handleSubmitError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    errors,
    setErrors,
  };
};
