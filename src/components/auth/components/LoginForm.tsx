
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PasswordInput from "./PasswordInput";
import BackendErrorAlert from "./BackendErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const LoginForm = () => {
  const {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    backendError,
    handleSubmit,
  } = useAuth(true);
  
  const { toast } = useToast();

  // Check for stored token on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // If token exists, navigate to dashboard
      console.log("Token found in localStorage, redirecting to dashboard");
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BackendErrorAlert error={backendError} />
      
      <div className="space-y-2">
        <Label htmlFor="username">Username or Email</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username or email"
          value={username || email}
          onChange={(e) => {
            if (e.target.value.includes('@')) {
              setEmail(e.target.value);
              setUsername("");
            } else {
              setUsername(e.target.value);
              setEmail("");
            }
          }}
          required
          className="w-full"
        />
      </div>
      
      <PasswordInput
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="text-right">
        <Button 
          variant="link" 
          className="p-0 h-auto" 
          onClick={(e) => {
            e.preventDefault();
            toast({ 
              title: "Reset link sent", 
              description: "If an account exists, you'll receive a reset email" 
            });
          }}
        >
          Forgot password?
        </Button>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
