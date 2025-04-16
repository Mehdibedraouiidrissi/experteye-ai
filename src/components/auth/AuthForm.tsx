
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthApi, useApiErrorHandler } from "@/services/api";

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm = ({ isLogin = true }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleError } = useApiErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login process
        await AuthApi.login(username || email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back to ExpertEye!",
        });
        navigate("/dashboard");
      } else {
        // Registration process
        await AuthApi.register(username, email, password);
        toast({
          title: "Account created successfully",
          description: "Your account has been created. You can now login.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      // Updated error message for login failures
      if (isLogin) {
        toast({
          title: "Login failed",
          description: "Username or password invalid. Please check your credentials or sign up if you don't have an account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: error?.message || "This username may already be taken.",
          variant: "destructive",
        });
      }
      
      // We're not calling handleError here to avoid displaying 'failed fetch' message
      // but we still log the error to console for debugging
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {isLogin ? "Login to your account" : "Create your account"}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin ? "Enter your credentials to access ExpertEye" : "Fill in the details to get started with ExpertEye"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
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
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <Button variant="link" className="p-0 h-auto" onClick={() => toast({ title: "Reset link sent", description: "If an account exists, you'll receive a reset email" })}>
                Forgot password?
              </Button>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={() => navigate(isLogin ? "/signup" : "/login")}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
