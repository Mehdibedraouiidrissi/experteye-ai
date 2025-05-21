
import { useEffect } from "react";

/**
 * Hook for handling form error clearing
 * Clears backend error when form fields change
 */
export const useFormErrorClear = (
  formFields: any[], 
  setBackendError: (error: string | null) => void
) => {
  useEffect(() => {
    setBackendError(null);
  }, [...formFields, setBackendError]);
};
