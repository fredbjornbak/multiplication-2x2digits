
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface TopicSelectionProps {
  subject: string;
  onSelect: (topic: string) => void;
  onBack: () => void;
}

const TopicSelection = ({ subject, onSelect, onBack }: TopicSelectionProps) => {
  // Topics for each subject
  const mathTopics = [
    { id: "multiplication", name: "Multiplication", available: true },
    { id: "division", name: "Division", available: false },
    { id: "fractions", name: "Fractions", available: false },
    { id: "algebra", name: "Algebra", available: false },
  ];

  const topics = subject === "math" ? mathTopics : [];

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-eco-forest animate-fade-in">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-eco-forest">
          Choose a topic to start learning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => topic.available && onSelect(topic.id)}
              disabled={!topic.available}
              className={`p-6 rounded-lg border-2 h-32 flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-in-out ${
                topic.available
                  ? "border-eco-forest bg-eco-forest/5 hover:bg-eco-forest/10 cursor-pointer"
                  : "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-xl mb-1">{topic.name}</div>
                {!topic.available && (
                  <span className="text-xs text-gray-500 font-medium">Coming soon</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-center pt-2 pb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="transition-all duration-300 ease-in-out"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TopicSelection;
