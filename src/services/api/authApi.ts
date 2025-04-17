
import { ApiService } from "./apiService";

export const AuthApi = {
  async login(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    
    try {
      console.log("Attempting login with:", { username });
      const response = await ApiService.request<{ access_token: string, token_type: string }>(
        "/auth/token",
        "POST",
        formData.toString(),
        true
      );
      
      if (!response || !response.access_token) {
        throw new Error("Invalid response format from server");
      }
      
      console.log("Login successful, setting token");
      ApiService.setToken(response.access_token);
      
      // Use window.location for a complete page reload to refresh state
      window.location.href = "/dashboard";
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  async register(username: string, email: string, password: string) {
    try {
      console.log("Attempting to register user:", { username, email });
      const userData = { username, email, password };
      
      return await ApiService.request(
        "/auth/register",
        "POST",
        userData
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  async getUserProfile() {
    try {
      return await ApiService.request("/auth/users/me", "GET");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
  
  logout() {
    console.log("Logging out user");
    ApiService.setToken(null);
    window.location.href = "/login";
  }
};
