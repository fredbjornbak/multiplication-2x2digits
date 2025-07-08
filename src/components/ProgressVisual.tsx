
import { useUserStore } from '@/store/userStore';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, TreeDeciduous, Cloud } from 'lucide-react';

const ProgressVisual = () => {
  const { userModel } = useUserStore();
  
  // Calculate overall mastery percentage
  const totalMastery = (
    userModel.multiplicationFluency.singleDigit * 33 +
    userModel.multiplicationFluency.doubleDigitSingle * 33 +
    userModel.multiplicationFluency.doubleDigitDouble * 34
  );
  
  // Calculate success rate
  const successfulExercises = userModel.previousExercises.filter(ex => ex.success).length;
  const totalExercises = userModel.previousExercises.length || 1; // Avoid division by zero
  const successRate = (successfulExercises / totalExercises) * 100;
  
  return (
    <Card className="shadow-md border-eco-forest/20">
      <CardHeader className="bg-gradient-to-r from-eco-forest/5 to-eco-sky/5 pb-2">
        <CardTitle className="text-eco-forest flex items-center gap-2">
          <TreeDeciduous className="h-5 w-5" /> Your Sustainability Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center gap-1">
                <Leaf className="h-4 w-4 text-eco-seedling" /> 
                Single-digit multiplication
              </span>
              <span>{Math.round(userModel.multiplicationFluency.singleDigit * 100)}%</span>
            </div>
            <Progress 
              value={userModel.multiplicationFluency.singleDigit * 100} 
              className="h-2 bg-eco-leaf/20" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center gap-1">
                <TreeDeciduous className="h-4 w-4 text-eco-forest" /> 
                Double-digit by single-digit
              </span>
              <span>{Math.round(userModel.multiplicationFluency.doubleDigitSingle * 100)}%</span>
            </div>
            <Progress 
              value={userModel.multiplicationFluency.doubleDigitSingle * 100} 
              className="h-2 bg-eco-forest/20" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center gap-1">
                <Cloud className="h-4 w-4 text-eco-sky" /> 
                Double-digit by double-digit
              </span>
              <span>{Math.round(userModel.multiplicationFluency.doubleDigitDouble * 100)}%</span>
            </div>
            <Progress 
              value={userModel.multiplicationFluency.doubleDigitDouble * 100} 
              className="h-2 bg-eco-sky/20" 
            />
          </div>
          
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Total mastery</span>
              <span>{Math.round(totalMastery)}%</span>
            </div>
            <Progress value={totalMastery} className="h-3 bg-eco-earth/20" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Success rate</span>
              <span>{Math.round(successRate)}%</span>
            </div>
            <Progress value={successRate} className="h-2 bg-eco-sun/20" />
          </div>
          
          <div className="text-sm text-muted-foreground mt-2 text-center">
            Total problems solved: {userModel.previousExercises.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressVisual;
