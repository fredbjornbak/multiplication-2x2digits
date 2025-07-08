
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface NameInputProps {
  onNext: (name: string) => void;
  onBack: () => void;
}

const NameInput = ({ onNext, onBack }: NameInputProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      toast.error("Please enter your name to continue");
      return;
    }
    
    onNext(name.trim());
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg border-eco-forest animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-eco-forest/10 flex items-center justify-center">
            <UserRound className="h-8 w-8 text-eco-forest" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-eco-forest">What's your name?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="text-lg py-6 transition-all duration-300 ease-in-out"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full py-6 text-lg transition-all duration-300 ease-in-out"
          >
            <span>Next</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pt-2 pb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="transition-all duration-300 ease-in-out"
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NameInput;
