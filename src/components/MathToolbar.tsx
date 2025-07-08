
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Group, RotateCcw, ArrowRight } from 'lucide-react';

interface MathToolbarProps {
  onAddCircle: () => void;
  onCombineCircles: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onAnswer: (answer: number) => void;
  currentPrompt: string;
  allowAddCircle: boolean;
  allowAnswer: boolean;
  circleCount: number;
  isLastPlanet: boolean;
  targetCircleCount: number;
  currentPlanetName: string;
  planetHint: string;
  isComplete: boolean;
}

const MathToolbar: React.FC<MathToolbarProps> = ({
  onAddCircle,
  onCombineCircles,
  onReset,
  onNextStep,
  onAnswer,
  currentPrompt,
  allowAddCircle,
  allowAnswer,
  circleCount,
  isLastPlanet,
  targetCircleCount,
  currentPlanetName,
  planetHint,
  isComplete
}) => {
  const [answerInput, setAnswerInput] = useState('');

  const handleAnswerSubmit = () => {
    const answer = parseInt(answerInput);
    if (!isNaN(answer)) {
      onAnswer(answer);
      setAnswerInput('');
    }
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={onAddCircle}
            disabled={!allowAddCircle}
            className="flex items-center gap-2"
            variant={allowAddCircle ? "default" : "secondary"}
          >
            <Plus className="w-4 h-4" />
            Add Circle
          </Button>
          
          <Button
            onClick={onCombineCircles}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Group className="w-4 h-4" />
            Group
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {allowAnswer && (
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Your answer"
              className="w-24"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswerSubmit();
                }
              }}
            />
            <Button onClick={handleAnswerSubmit}>
              Submit
            </Button>
          </div>
        )}

        <div className="text-sm text-gray-600">
          Circles: {circleCount} / {targetCircleCount}
        </div>
      </div>
    </Card>
  );
};

export default MathToolbar;
