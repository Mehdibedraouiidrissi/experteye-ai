
/**
 * Validation utilities for authentication
 */

/**
 * Validates that an email belongs to the ExpertEye domain
 */
export const validateExpertEyeEmail = (email: string): boolean => {
  return email.endsWith("@experteye.com");
};

/**
 * Validates password according to requirements
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8 || password.length > 12) {
    return {
      valid: false,
      message: "Password must be between 8 and 12 characters"
    };
  }

  if (!/^[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must start with an uppercase letter"
    };
  }

  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one digit"
    };
  }

  return { valid: true, message: "" };
};
