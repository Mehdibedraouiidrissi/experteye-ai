
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuthFormFooter from "./components/AuthFormFooter";

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm = ({ isLogin = true }: AuthFormProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </CardContent>
      <CardFooter>
        <AuthFormFooter isLogin={isLogin} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
