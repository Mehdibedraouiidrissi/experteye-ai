
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
  const errors: string[] = [];
  
  if (password.length < 8 || password.length > 12) {
    errors.push("Password must be between 8 and 12 characters");
  }

  if (!/^[A-Z]/.test(password)) {
    errors.push("Password must start with an uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one digit");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
    errors.push("Password must contain at least one special character (e.g., !@#$%^&*)");
  }

  return { 
    valid: errors.length === 0, 
    message: errors.length > 0 ? errors.join(". ") : "" 
  };
};
