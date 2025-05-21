
/**
 * Utility functions for login form validation
 */

/**
 * Validates login input
 * Returns an error message if validation fails, null otherwise
 */
export const validateLoginInput = (usernameOrEmail: string, password: string): string | null => {
  if (!usernameOrEmail) {
    return "Please enter a username or email.";
  }
  
  if (!password) {
    return "Please enter your password.";
  }
  
  return null;
};
