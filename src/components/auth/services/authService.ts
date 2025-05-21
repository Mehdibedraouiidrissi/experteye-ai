
import { AuthApi, ApiService } from "@/services/api";
import { validateLoginInput } from "../utils/loginValidation";
import { validateRegistrationInput } from "../utils/registrationValidation";

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
   * Delegates to the dedicated validation utility
   */
  static validateLoginInput(usernameOrEmail: string, password: string): string | null {
    return validateLoginInput(usernameOrEmail, password);
  }

  /**
   * Validates registration input
   * Delegates to the dedicated validation utility
   */
  static validateRegistrationInput(
    username: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): string | null {
    return validateRegistrationInput(username, email, password, confirmPassword);
  }
}
