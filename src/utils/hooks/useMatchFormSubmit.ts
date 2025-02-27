import { useState } from "react";
import { TFormData } from "../validators/types";
import { handleMatchSubmitError } from "../errors/errorHandlers";

export const useMatchFormSubmit = (options: {
  onSuccess: () => void;
  onError: (error: unknown) => void;
  apiCall: (data: any) => Promise<any>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (formData: TFormData) => {
    try {
      setIsLoading(true);
      const response = await options.apiCall(formData);
      options.onSuccess();
    } catch (error) {
      handleMatchSubmitError(errors, setErrors, "생성");
      options.onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, errors, setErrors };
};
