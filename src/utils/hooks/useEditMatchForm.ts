import { useEffect, useState } from "react";
import { TFormData } from "../validators/types";

export const useEditMatchForm = (initialMatchData: any) => {
  const [formData, setFormData] = useState<TFormData>({
    title: "",
    description: "",
    courtName: "",
    district: "",
    locationDetail: "",
    date: "",
    time: "",
    level: "BEGINNER",
    maxPlayers: 6,
    cost: 0,
    rules: [""],
  });

  const [focusedInput, setFocusedInput] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  useEffect(() => {
    if (initialMatchData) {
      setFormData({
        title: initialMatchData.title,
        description: initialMatchData.description,
        courtName: initialMatchData.courtName,
        district: initialMatchData.district,
        locationDetail: initialMatchData.locationDetail,
        date: initialMatchData.date,
        time: initialMatchData.time,
        level: initialMatchData.level,
        maxPlayers: initialMatchData.maxPlayers,
        cost: initialMatchData.cost,
        rules: initialMatchData.rules.split(","),
      });
    }
  }, [initialMatchData]);

  const updateFormData = (field: keyof TFormData, value: any) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      console.log("Updated formData:", updated);
      return updated;
    });
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
