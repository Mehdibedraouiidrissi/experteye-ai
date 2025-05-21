
import { AuthApi, ApiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Service for handling authentication operations
 */
export class AuthService {
  /**
   * Handles the login process
   */
  static async login(
    identifier: string, 
    password: string, 
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) {
    try {
      console.log(`Attempting login with identifier: ${identifier}`);
      
      // Call the AuthApi login method
      await AuthApi.login(identifier, password);
      
      // If login is successful and onSuccess callback is provided, call it
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // If onError callback is provided, call it with the error
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }

  /**
   * Handles the registration process
   */
  static async register(
    username: string, 
    email: string, 
    password: string,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) {
    try {
      console.log(`Attempting to register with username: ${username}, email: ${email}`);
      
      // Call the AuthApi register method
      const result = await AuthApi.register(username, email, password);
      
      // If registration is successful and onSuccess callback is provided, call it
      if (onSuccess) {
        onSuccess();
      }
      
      return result;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // If onError callback is provided, call it with the error
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }

  /**
   * Validates login input
   * Returns an error message if validation fails, null otherwise
   */
  static validateLoginInput(usernameOrEmail: string, password: string): string | null {
    if (!usernameOrEmail) {
      return "Please enter a username or email.";
    }
    
    if (!password) {
      return "Please enter your password.";
    }
    
    return null;
  }

  /**
   * Validates registration input
   * Returns an error message if validation fails, null otherwise
   */
  static validateRegistrationInput(
    username: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): string | null {
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
  }
}
