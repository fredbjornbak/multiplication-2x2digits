
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, BookText, FlaskConical, GraduationCap, ArrowLeft } from "lucide-react";

interface SubjectSelectionProps {
  userName: string;
  onSelect: (subject: string) => void;
  onBack: () => void;
}

const SubjectSelection = ({ userName, onSelect, onBack }: SubjectSelectionProps) => {
  const subjects = [
    { id: "math", name: "Mathematics", icon: Calculator, available: true },
    { id: "reading", name: "Reading", icon: BookText, available: false },
    { id: "science", name: "Science", icon: FlaskConical, available: false },
    { id: "history", name: "History", icon: GraduationCap, available: false },
  ];

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-eco-forest animate-fade-in">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-eco-forest">
          Hi {userName}! What would you like to learn today?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() => subject.available && onSelect(subject.id)}
              disabled={!subject.available}
              className={`p-6 rounded-lg border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out ${
                subject.available
                  ? "border-eco-forest bg-eco-forest/5 hover:bg-eco-forest/10 cursor-pointer"
                  : "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
              }`}
            >
              <subject.icon className={`h-12 w-12 ${subject.available ? "text-eco-forest" : "text-gray-400"}`} />
              <div className="text-center">
                <div className="font-semibold text-lg">{subject.name}</div>
                {!subject.available && (
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

export default SubjectSelection;
