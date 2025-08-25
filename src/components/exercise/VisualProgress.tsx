import { cn } from "@/lib/utils";

interface VisualProgressProps {
  currentIndex: number;
  totalQuestions: number;
  className?: string;
}

const VisualProgress = ({ currentIndex, totalQuestions, className }: VisualProgressProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Visual Dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index <= currentIndex
                ? "bg-primary scale-110 shadow-sm"
                : "bg-muted border-2 border-muted-foreground/20"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default VisualProgress;