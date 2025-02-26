import { useState } from "react";
import { TFormData } from "../validators/types";

export const useMatchForm = () => {
  const [formData, setFormData] = useState<TFormData>({
    title: "",
    description: "",
    courtName: "",
    district: "",
    locationDetail: "",
    date: "",
    time: "",
    level: "BEGINNER",
    maxPlayers: 0,
    cost: 0,
    rules: [""],
  });
  const [focusedInput, setFocusedInput] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  const updateFormData = (field: keyof TFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateFormData,
    focusedInput,
    setFocusedInput,
    showDatePicker,
    setShowDatePicker,
    showLevelModal,
    setShowLevelModal,
  };
};
