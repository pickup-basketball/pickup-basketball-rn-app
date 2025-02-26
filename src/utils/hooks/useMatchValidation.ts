import { validateForm } from "../validators/matchValidator";
import { TFormData } from "../validators/types";

export const useMatchValidation = () => {
  const validateMatchForm = (data: TFormData) => {
    return validateForm(data);
  };

  return {
    validateMatchForm,
  };
};
