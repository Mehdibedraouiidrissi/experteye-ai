
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
  
  // Password validation
  if (password.length < 8 || password.length > 12) {
    return "Password must be between 8 and 12 characters.";
  }
  
  if (!/^[A-Z]/.test(password)) {
    return "Password must start with an uppercase letter.";
  }
  
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit.";
  }
  
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  
  return null;
};
