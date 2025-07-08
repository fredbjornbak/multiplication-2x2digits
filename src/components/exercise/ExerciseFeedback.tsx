import { cn } from "@/lib/utils";

interface ExerciseFeedbackProps {
  feedback: string;
  isCorrect: boolean | null;
}

const ExerciseFeedback = ({ feedback, isCorrect }: ExerciseFeedbackProps) => {
  if (!feedback) return null;

  return (
    <div className={cn(
      "p-4 rounded-xl text-center font-medium border-2 transition-all", 
      isCorrect ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
    )}>
      {feedback}
    </div>
  );
};

export default ExerciseFeedback;