
import { useEffect } from "react";
import HomePage from "./HomePage";

const Index = () => {
  useEffect(() => {
    document.title = "ExpertEye - Intelligent Document Analysis";
  }, []);

  return <HomePage />;
};

export default Index;
