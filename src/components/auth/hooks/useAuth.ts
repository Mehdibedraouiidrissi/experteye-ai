
import { useAuthFormFields } from "./utils/formHandlingUtils";
import { useAuthInit } from "./useAuthInit";
import { useAuthSubmit } from "./useAuthSubmit";
import { useFormErrorClear } from "./utils/formErrorUtils";

/**
 * Main hook for authentication forms
 */
export const useAuth = (isLogin: boolean) => {
  // Get form field state
  const {
    email, setEmail,
    username, setUsername,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, setIsLoading
  } = useAuthFormFields(isLogin);
  
  // Initialize authentication and backend check
  const {
    isBackendAvailable,
    backendError,
    setBackendError,
    isRetrying,
    retryBackendConnection,
  } = useAuthInit(isLogin);

  // Clear backend error when form fields change
  useFormErrorClear(
    [username, email, password, confirmPassword],
    setBackendError
  );

  // Get form submission handler
  const { handleSubmit } = useAuthSubmit(
    isLogin,
    { email, username, password, confirmPassword },
    setIsLoading,
    setBackendError,
    isBackendAvailable,
    retryBackendConnection
  );

  return {
    // Form field state
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    
    // Loading and error state
    isLoading,
    isRetrying,
    backendError,
    isBackendAvailable,
    
    // Actions
    retryBackendConnection,
    handleSubmit,
  };
};
