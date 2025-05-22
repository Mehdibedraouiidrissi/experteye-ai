
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Documents from "@/pages/Documents";
import Settings from "@/pages/Settings";
import ChatDemo from "@/pages/ChatDemo";
import NotFound from "@/pages/NotFound";
import { ThemeProvider } from "@/components/theme-provider";
import Account from "@/pages/Account";

function App() {
  const { isLoggedIn } = useAuth();

  const ProtectedRoute = () => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  };

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-tailwind-theme"
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
          </Route>
          
          {/* Chat demo route */}
          <Route path="/chat-demo" element={<ChatDemo />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
