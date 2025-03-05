import { TFormData } from "../validators/types";

export const handleDateTimeChange = (
  selectedDate: Date | undefined,
  updateFormData: (field: keyof TFormData, value: any) => void
) => {
  if (selectedDate) {
    console.log("새로 선택한 날짜:", selectedDate);

    // 날짜 형식: YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // 시간 형식: HH:MM
    const hours = String(selectedDate.getHours()).padStart(2, "0");
    const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    console.log("업데이트할 날짜:", dateStr, "시간:", timeStr);

    updateFormData("date", dateStr);
    updateFormData("time", timeStr);
  }
};

export const handleRuleChange = (
  index: number,
  text: string,
  rules: string[],
  updateFormData: (field: keyof TFormData, value: any) => void
) => {
  const newRules = [...rules];
  newRules[index] = text;
  updateFormData("rules", newRules);
};

export const handleAddRule = (
  rules: string[],
  updateFormData: (field: keyof TFormData, value: any) => void
) => {
  updateFormData("rules", [...rules, ""]);
};

export const handleRemoveRule = (
  index: number,
  rules: string[],
  updateFormData: (field: keyof TFormData, value: any) => void
) => {
  updateFormData(
    "rules",
    rules.filter((_, i) => i !== index)
  );
};
