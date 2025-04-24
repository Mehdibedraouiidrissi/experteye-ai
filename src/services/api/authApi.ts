
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
        console.error("Invalid response format from server:", response);
        throw new Error("Invalid response format from server");
      }
      
      console.log("Login successful, setting token:", response.access_token.substring(0, 10) + "...");
      ApiService.setToken(response.access_token);
      
      // Store username for admin check
      localStorage.setItem("username", username);
      
      // Get user profile to verify token
      try {
        const profile = await this.getUserProfile();
        console.log("User profile verified successfully:", profile);
        
        // Redirect to dashboard after successful login and profile verification
        // Add a small delay to ensure the token is properly set
        setTimeout(() => {
          console.log("Redirecting to dashboard...");
          window.location.href = "/dashboard";
        }, 100);
        
        return response;
      } catch (profileError) {
        console.error("Profile verification failed:", profileError);
        // Logout if profile verification fails
        this.logout();
        throw new Error("Authentication session verification failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  async register(username: string, email: string, password: string) {
    try {
      console.log("Attempting to register user:", { username, email });
      
      const userData = {
        username: username,
        email: email,
        password: password
      };
      
      const response = await ApiService.request(
        "/auth/register",
        "POST",
        userData
      );
      
      console.log("Registration successful:", response);
      return response;
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
    ApiService.clearStorage();
    window.location.replace("/login?logout=true&_t=" + new Date().getTime());
  },
  
  isAuthenticated() {
    return !!ApiService.getToken();
  }
};
