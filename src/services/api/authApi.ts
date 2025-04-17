
import { ApiService } from "./apiService";
import { useNavigate } from "react-router-dom";

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
      
      // Create a proper request body
      const userData = {
        username: username,
        email: email,
        password: password
      };
      
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
    // Clear token
    ApiService.setToken(null);
    
    // Clear all storage to prevent cache issues
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies related to authentication
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
    
    // Force a full page reload to clear any in-memory state
    window.location.href = "/login";
  }
};
