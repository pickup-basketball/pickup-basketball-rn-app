import { useState } from "react";
import { Alert } from "react-native";
import { matchEventEmitter } from "../event";
import { TFormData } from "../validators/types";
import axiosInstance from "../../api/axios-interceptor";
import { handleMatchSubmitError } from "../errors/errorHandlers";
import { StackNavigationProp } from "@react-navigation/stack";
import { MyPageStackParamList } from "../../types/navigation";
import { RouteProp } from "@react-navigation/native";

type EditScreenNavigationProp = StackNavigationProp<
  MyPageStackParamList,
  "EditMatch"
>;

export const useEditMatchSubmit = (
  navigation: EditScreenNavigationProp,
  validateForm: (data: TFormData) => {
    isValid: boolean;
    errors: { [key: string]: string };
  },
  matchId: string,
  matchData: any,
  route?: RouteProp<MyPageStackParamList, "EditMatch">
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const createPayload = (formData: TFormData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      courtName: formData.courtName,
      district: formData.district,
      locationDetail: formData.locationDetail,
      date: formData.date,
      time: formData.time.includes(":00")
        ? formData.time
        : `${formData.time}:00`,
      level: formData.level,
      currentPlayers: parseInt(String(matchData.currentPlayers), 10) || 1,
      maxPlayers: parseInt(String(formData.maxPlayers), 10),
      cost: parseInt(String(formData.cost), 10),
      rules: Array.isArray(formData.rules)
        ? formData.rules.join(", ")
        : formData.rules,
    };

    return payload;
  };

  const handleSubmit = async (formData: TFormData) => {
    try {
      const { isValid, errors: validationErrors } = validateForm(formData);

      if (!isValid) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);

      const payload = createPayload(formData);
      console.log("Final payload to be sent:", payload);

      const response = await axiosInstance.put(`/matches/${matchId}`, payload);
      console.log("Server response:", response.data);

      if (response.status === 200) {
        matchEventEmitter.emit("matchUpdated");
        matchEventEmitter.emit("matchCreated");

        Alert.alert("성공", "매치가 수정되었습니다", [
          {
            text: "확인",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.log("Submit error:", error);
      handleMatchSubmitError(error, setErrors, "수정");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, errors };
};
