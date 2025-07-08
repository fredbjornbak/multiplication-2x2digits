import { cn } from "@/lib/utils";

interface VisualProgressProps {
  currentIndex: number;
  totalQuestions: number;
  className?: string;
}

const VisualProgress = ({ currentIndex, totalQuestions, className }: VisualProgressProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: totalQuestions }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            index <= currentIndex
              ? "bg-primary scale-110 shadow-sm"
              : "bg-muted border-2 border-muted-foreground/20"
          )}
        />
      ))}
    </div>
  );
};

export default VisualProgress;