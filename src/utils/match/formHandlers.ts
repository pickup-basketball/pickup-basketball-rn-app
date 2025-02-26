import { TFormData } from "../validators/types";

export const handleDateTimeChange = (
  selectedDate: Date | undefined,
  updateFormData: (field: keyof TFormData, value: any) => void
) => {
  if (selectedDate) {
    const date = selectedDate.toISOString().split("T")[0];
    const time = selectedDate.toTimeString().split(" ")[0];
    updateFormData("date", date);
    updateFormData("time", time);
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
