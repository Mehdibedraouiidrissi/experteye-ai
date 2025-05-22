
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in based on localStorage token
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  
  return { isLoggedIn };
};
