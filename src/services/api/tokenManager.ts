
/**
 * Token management utilities for API authentication
 */
export class TokenManager {
  private static token: string | null = null;

  /**
   * Sets the auth token and stores it in localStorage if provided
   */
  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
      console.log("Auth token set successfully");
    } else {
      localStorage.removeItem("auth_token");
    }
  }
  
  /**
   * Gets the auth token from memory or localStorage
   */
  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("auth_token");
    }
    return this.token;
  }

  /**
   * Clears all browser storage (localStorage, sessionStorage, cookies)
   */
  static clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    });
    this.token = null;
  }
}
