import { TFormData } from "../validators/types";

export const formatPayload = (formData: TFormData) => {
  const rulesString = formData.rules
    .filter((rule) => rule.trim() !== "")
    .join(",");

  return {
    title: formData.title.trim(),
    description: formData.description.trim(),
    courtName: formData.courtName.trim(),
    location: formData.location.trim(),
    date: formData.date,
    time: formData.time,
    level: formData.level,
    currentPlayers: 1,
    maxPlayers: formData.maxPlayers,
    cost: Number(formData.cost),
    rules: rulesString,
  };
};
