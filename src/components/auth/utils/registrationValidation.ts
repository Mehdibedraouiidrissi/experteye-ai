
/**
 * Utility functions for registration form validation
 */

/**
 * Validates registration input
 * Returns an error message if validation fails, null otherwise
 */
export const validateRegistrationInput = (
  username: string, 
  email: string, 
  password: string, 
  confirmPassword: string
): string | null => {
  if (!username || username.trim() === "") {
    return "Please enter a valid username.";
  }
  
  if (!email || !email.endsWith("@experteye.com")) {
    return "Only @experteye.com email addresses are allowed.";
  }
  
  // Password validation - check all requirements at once and provide detailed error message
  const passwordErrors = validatePassword(password);
  if (passwordErrors) {
    return passwordErrors;
  }
  
  if (password !== confirmPassword) {
    return "Passwords do not match. Please ensure both entries are identical.";
  }
  
  return null;
};

/**
 * Validates password according to security requirements
 * Returns detailed error message if validation fails, null otherwise
 */
export const validatePassword = (password: string): string | null => {
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
  
  // Return null if no errors, otherwise join all error messages
  return errors.length === 0 ? null : errors.join(". ");
};
