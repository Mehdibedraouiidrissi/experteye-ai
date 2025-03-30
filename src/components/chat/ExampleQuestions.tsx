
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ExampleQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const ExampleQuestions = ({ questions, onQuestionClick }: ExampleQuestionsProps) => {
  return (
    <div className="px-4 py-4 flex flex-wrap gap-2 justify-center">
      {questions.map((question) => (
        <Button
          key={question}
          variant="outline"
          className="text-sm"
          onClick={() => onQuestionClick(question)}
        >
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          {question}
        </Button>
      ))}
    </div>
  );
};

export default ExampleQuestions;
