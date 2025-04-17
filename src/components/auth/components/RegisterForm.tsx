
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Info } from "lucide-react";
import PasswordInput from "./PasswordInput";
import BackendErrorAlert from "./BackendErrorAlert";
import { useAuth } from "../hooks/useAuth";

const RegisterForm = () => {
  const {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    backendError,
    handleSubmit,
  } = useAuth(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BackendErrorAlert error={backendError} />
      
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
        <p className="text-xs text-muted-foreground">
          <Info className="inline h-3 w-3 mr-1" />
          Username must be unique
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@experteye.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          <Info className="inline h-3 w-3 mr-1" />
          Only @experteye.com email addresses are allowed
        </p>
      </div>
      
      <div className="space-y-2">
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p><Info className="inline h-3 w-3 mr-1" />Must be 8-12 characters</p>
          <p><Info className="inline h-3 w-3 mr-1" />Must start with an uppercase letter</p>
          <p><Info className="inline h-3 w-3 mr-1" />Must contain at least one digit</p>
          <p><Info className="inline h-3 w-3 mr-1" />Must be unique across all users</p>
        </div>
      </div>
      
      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
