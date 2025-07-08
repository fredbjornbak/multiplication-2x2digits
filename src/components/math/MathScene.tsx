import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { toast } from 'sonner';
import MathToolbar from '../MathToolbar';
import SceneContent from './SceneContent';
import { randomPosition, CIRCLE_COLORS } from '@/utils/mathUtils';
import { SOLAR_SYSTEM_DATA, SolarSystemBody } from '@/utils/solarSystemData';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '../ErrorBoundary';
import { Progress } from '@/components/ui/progress';

// Constants
export const GROUPED_CIRCLE_COLOR = "#FFD700"; // Yellow color for grouped circles

interface Circle {
  id: number;
  position: [number, number, number];
  color: string;
  isAnimating?: boolean;
  targetPosition?: [number, number, number];
  group?: number;
  isNew?: boolean; // Track newly added circles
}

interface Step {
  prompt: string;
  targetCircles: number;
  action: 'add' | 'answer' | 'combine';
}

interface TutorStep {
  prompt: string;
  action: 'add' | 'answer' | 'group' | 'merge';
  count?: number;
}

interface MathSceneProps {
  onComplete?: () => void;
  currentTutorStep: TutorStep;
  onStepComplete: (stepType: string, currentCount: number, correctAnswer: boolean) => void;
  currentPlanetIndex: number;
  targetCircleCount: number;
  currentCircleCount: number;
}

const MathScene: React.FC<MathSceneProps> = ({ 
  onComplete,
  currentTutorStep,
  onStepComplete,
  currentPlanetIndex,
  targetCircleCount,
  currentCircleCount
}) => {
  // State declarations
  const [circles, setCircles] = useState<Circle[]>([]);
  const [selectedCircles, setSelectedCircles] = useState<number[]>([]);
  const [nextId, setNextId] = useState(1);
  const [completedPlanets, setCompletedPlanets] = useState<string[]>([]);
  const [highestProgress, setHighestProgress] = useState(0);
  const [lastAddCount, setLastAddCount] = useState(0);
  const [groupedCircles, setGroupedCircles] = useState<{[id: number]: boolean}>({});
  const [lastGroupCreated, setLastGroupCreated] = useState<number | null>(null);
  
  const currentPlanet = SOLAR_SYSTEM_DATA[currentPlanetIndex];
  const isLastPlanet = currentPlanetIndex === SOLAR_SYSTEM_DATA.length - 1;
  
  // Helper functions - defined before they're used in effects
  const createCircleGroup = useCallback(() => {
    if (selectedCircles.length < 2) {
      toast("Select circles! 👆", {
        description: "Click on at least two circles to group them together.",
        duration: 3000,
      });
      return;
    }
    
    // Create a new group for the selected circles and color them yellow
    const nextGroup = Date.now(); // Use timestamp as a unique group identifier
    setCircles(prev => prev.map(circle => {
      if (selectedCircles.includes(circle.id)) {
        return { 
          ...circle, 
          group: nextGroup,
          color: GROUPED_CIRCLE_COLOR,
          isNew: false // No longer new after grouping
        };
      }
      return circle;
    }));
    
    // Mark these circles as grouped
    const newGroupedCircles = { ...groupedCircles };
    selectedCircles.forEach(id => {
      newGroupedCircles[id] = true;
    });
    setGroupedCircles(newGroupedCircles);
    
    // Clear selection after grouping
    setSelectedCircles([]);
    
    toast("Group created! 🌟", {
      description: "Great job! You've grouped these circles together.",
      duration: 2000,
    });
    
    // If this was in response to a group action, notify parent
    if (currentTutorStep.action === 'group') {
      onStepComplete('group', circles.length, true);
    }
  }, [circles, currentTutorStep, groupedCircles, onStepComplete, selectedCircles]);
  
  const combineAllGroups = useCallback(() => {
    if (circles.length === 0) return;
    
    // Calculate the center of all circles for our new combined group
    const centerX = 0;
    const centerY = 0;
    
    // Calculate how to arrange the circles in a spiral pattern
    const arrangeCirclesInSpiral = (totalCircles: number): [number, number, number][] => {
      const positions: [number, number, number][] = [];
      const baseSpacing = 1.5; // Base spacing between circles
      const spiralFactor = 0.3; // How quickly the spiral expands
      
      // For small groups, use a circular layout
      if (totalCircles <= 8) {
        const radius = Math.max(2, totalCircles * 0.5);
        const angle = (2 * Math.PI) / totalCircles;
        
        for (let i = 0; i < totalCircles; i++) {
          const x = centerX + radius * Math.cos(i * angle);
          const y = centerY + radius * Math.sin(i * angle);
          positions.push([x, y, 0]);
        }
      } 
      // For larger groups, use a spiral layout to prevent overlapping
      else {
        let angle = 0;
        let radius = baseSpacing;
        
        for (let i = 0; i < totalCircles; i++) {
          // Calculate position on spiral
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          positions.push([x, y, 0]);
          
          // Increment angle and radius for next circle
          angle += (2 * Math.PI) / (radius * 2); // Adjust angle increment based on radius
          radius += spiralFactor / (2 * Math.PI); // Gradually increase radius
        }
      }
      
      return positions;
    };
    
    // Get positions for all circles
    const positions = arrangeCirclesInSpiral(circles.length);
    
    // Put all circles into group 1 and assign them new positions
    setCircles(prev => prev.map((circle, index) => ({
      ...circle,
      group: 1,
      color: GROUPED_CIRCLE_COLOR,
      isNew: false,
      // Assign each circle its position in the pattern
      isAnimating: true,
      targetPosition: positions[index]
    })));
    
    // Mark all circles as grouped
    const groupMap: {[id: number]: boolean} = {};
    circles.forEach(circle => {
      groupMap[circle.id] = true;
    });
    setGroupedCircles(groupMap);
  }, [circles]);
  
  const handleCircleClick = (id: number) => {
    setSelectedCircles(prev => {
      if (prev.includes(id)) {
        return prev.filter(circleId => circleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const resetPlanet = () => {
    setCircles([]);
    setSelectedCircles([]);
    setNextId(1);
    setGroupedCircles({});
    setHighestProgress(0);
    
    toast("Starting fresh! 🔄", {
      description: `Let's rebuild ${currentPlanet.name} from the beginning.`,
      duration: 3000,
    });
  };
  
  const calculateSafeRadius = (targetCirclesToAdd: number) => {
    // Calculate positions that avoid existing grouped circles
    const groupCenters: Array<{center: [number, number, number], radius: number}> = [];
    
    // Get the centers and radii of all grouped circles
    const groupMap: {[key: number]: Circle[]} = {};
    circles.forEach(circle => {
      if (circle.group !== undefined) {
        if (!groupMap[circle.group]) {
          groupMap[circle.group] = [];
        }
        groupMap[circle.group].push(circle);
      }
    });
    
    Object.values(groupMap).forEach(group => {
      if (group.length > 0) {
        const center: [number, number, number] = [0, 0, 0];
        group.forEach(circle => {
          const pos = circle.targetPosition || circle.position;
          center[0] += pos[0];
          center[1] += pos[1];
          center[2] += pos[2];
        });
        
        center[0] /= group.length;
        center[1] /= group.length;
        center[2] = 0;
        
        let maxRadius = 0;
        group.forEach(circle => {
          const pos = circle.targetPosition || circle.position;
          const distance = Math.sqrt(
            Math.pow(pos[0] - center[0], 2) + 
            Math.pow(pos[1] - center[1], 2)
          );
          maxRadius = Math.max(maxRadius, distance);
        });
        
        // Add buffer to ensure new circles are clearly outside the group
        groupCenters.push({
          center: center as [number, number, number],
          radius: maxRadius + 3.0 // Extra buffer to ensure clear separation
        });
      }
    });
    
    // Base radius for positioning new circles
    let safeRadius = Math.sqrt(circles.length + targetCirclesToAdd) * 1.2;
    
    // Adjust radius to avoid existing group centers
    if (groupCenters.length > 0) {
      groupCenters.forEach(group => {
        // Calculate how far this group is from the center
        const distanceFromCenter = Math.sqrt(
          Math.pow(group.center[0], 2) + 
          Math.pow(group.center[1], 2)
        );
        
        // Ensure new circles are placed outside this group's boundary
        const requiredRadius = distanceFromCenter + group.radius + 2.5;
        safeRadius = Math.max(safeRadius, requiredRadius);
      });
    }
    
    return safeRadius;
  };
  
  const addCircle = () => {
    if (!allowAddCircle) {
      toast("Wait! 🤚", {
        description: "Please follow the current instruction before adding more circles.",
        duration: 3000,
      });
      return;
    }
    
    const targetCirclesToAdd = currentTutorStep.count || 1;
    const shouldAddMultiple = targetCirclesToAdd > 1;
    
    // Find a safe position away from existing groups
    const findSafeGroupPosition = (): [number, number] => {
      // Calculate existing group centers and boundaries
      const existingGroups: Array<{center: [number, number], radius: number}> = [];
      
      // Group circles by their group ID
      const groupedCircleMap: {[key: number]: Circle[]} = {};
      circles.forEach(circle => {
        if (circle.group !== undefined) {
          if (!groupedCircleMap[circle.group]) {
            groupedCircleMap[circle.group] = [];
          }
          groupedCircleMap[circle.group].push(circle);
        }
      });
      
      // Calculate the center and radius of each group
      Object.values(groupedCircleMap).forEach(groupCircles => {
        if (groupCircles.length > 0) {
          let centerX = 0;
          let centerY = 0;
          
          groupCircles.forEach(circle => {
            const pos = circle.targetPosition || circle.position;
            centerX += pos[0];
            centerY += pos[1];
          });
          
          centerX /= groupCircles.length;
          centerY /= groupCircles.length;
          
          // Calculate the maximum distance from center to any circle
          let maxRadius = 0;
          groupCircles.forEach(circle => {
            const pos = circle.targetPosition || circle.position;
            const distance = Math.sqrt(
              Math.pow(pos[0] - centerX, 2) + 
              Math.pow(pos[1] - centerY, 2)
            );
            maxRadius = Math.max(maxRadius, distance);
          });
          
          // Add a buffer to the radius
          existingGroups.push({
            center: [centerX, centerY],
            radius: maxRadius + 3.0  // Extra buffer to ensure separation
          });
        }
      });
      
      // Use quadrants to position new group
      // Try to find the emptiest quadrant by checking distance to existing groups
      const quadrants = [
        [1, 1],   // top-right
        [-1, 1],  // top-left
        [-1, -1], // bottom-left
        [1, -1]   // bottom-right
      ];
      
      let bestQuadrant = quadrants[0];
      let maxDistance = -Infinity;
      
      // Base distance from center - make it proportional to number of circles
      const baseDistance = Math.max(5, Math.sqrt(circles.length + targetCirclesToAdd) * 1.2);
      
      quadrants.forEach(([xDir, yDir]) => {
        const testPoint: [number, number] = [xDir * baseDistance, yDir * baseDistance];
        
        // Calculate minimum distance to any existing group
        let minDistanceToGroups = Infinity;
        
        existingGroups.forEach(group => {
          const distanceToGroup = Math.sqrt(
            Math.pow(testPoint[0] - group.center[0], 2) + 
            Math.pow(testPoint[1] - group.center[1], 2)
          );
          
          // Subtract the group's radius to get distance to edge
          const clearDistance = distanceToGroup - group.radius;
          minDistanceToGroups = Math.min(minDistanceToGroups, clearDistance);
        });
        
        // We want the quadrant with the maximum minimum distance to any group
        if (minDistanceToGroups > maxDistance) {
          maxDistance = minDistanceToGroups;
          bestQuadrant = [xDir, yDir];
        }
      });
      
      // Calculate final position with some randomness
      const jitter = 2.0; // Amount of random variation
      const finalX = bestQuadrant[0] * baseDistance + (Math.random() - 0.5) * jitter;
      const finalY = bestQuadrant[1] * baseDistance + (Math.random() - 0.5) * jitter;
      
      return [finalX, finalY];
    };
    
    // Find the center position for the new group of circles
    const [groupCenterX, groupCenterY] = findSafeGroupPosition();
    
    // Create a unique group ID for these new circles
    const newGroupId = Date.now();
    setLastGroupCreated(newGroupId);
    
    // Function to calculate positions around the group center
    const calculateCirclePositions = (total: number, centerX: number, centerY: number): [number, number, number][] => {
      const positions: [number, number, number][] = [];
      
      // For a single circle, just put it at the center
      if (total === 1) {
        positions.push([centerX, centerY, 0]);
        return positions;
      }
      
      // For small groups, arrange in a circle
      const radius = Math.max(1.2, total * 0.3); // Radius scales with count but has a minimum
      const angleStep = (2 * Math.PI) / total;
      
      for (let i = 0; i < total; i++) {
        const angle = i * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push([x, y, 0]);
      }
      
      return positions;
    };
    
    if (shouldAddMultiple) {
      // Calculate positions for multiple circles
      const positions = calculateCirclePositions(targetCirclesToAdd, groupCenterX, groupCenterY);
      
      // Add multiple circles at once
      const newCircles: Circle[] = [];
      
      for (let i = 0; i < targetCirclesToAdd; i++) {
        newCircles.push({
          id: nextId + i,
          position: positions[i],
          color: CIRCLE_COLORS[Math.floor(Math.random() * CIRCLE_COLORS.length)],
          isNew: true, // Mark as newly added
          group: newGroupId // Put in the new group
        });
      }
      
      setCircles(prev => [...prev, ...newCircles]);
      setNextId(nextId + targetCirclesToAdd);
      setLastAddCount(targetCirclesToAdd);
      
      // Select the newly added circles
      const newIds = newCircles.map(c => c.id);
      setSelectedCircles(newIds);
      
      // Notify parent component of step completion
      onStepComplete('add', circles.length + targetCirclesToAdd, true);
    } else {
      // Just add a single circle at the group center
      const newCircle: Circle = {
        id: nextId,
        position: [groupCenterX, groupCenterY, 0],
        color: CIRCLE_COLORS[Math.floor(Math.random() * CIRCLE_COLORS.length)],
        isNew: true, // Mark as newly added
        group: newGroupId // Put in the new group
      };
      
      setCircles(prev => [...prev, newCircle]);
      setNextId(nextId + 1);
      setLastAddCount(1);
      setSelectedCircles([newCircle.id]);
      
      // Notify parent component of step completion
      onStepComplete('add', circles.length + 1, true);
    }
  };
  
  const handleAnswer = (answer: number) => {
    let isCorrect = false;
    
    if (currentTutorStep.action === 'answer') {
      // For answering about the total count
      if (currentTutorStep.prompt.includes("in total")) {
        isCorrect = answer === circles.length;
      } 
      // For answering about the newest group
      else if (currentTutorStep.prompt.includes("in this new group") || 
               currentTutorStep.prompt.includes("in the new group") ||
               currentTutorStep.prompt.includes("newest group")) {
        isCorrect = answer === lastAddCount;
      }
      // Generic count question
      else {
        isCorrect = answer === circles.length;
      }
    }
    else if (currentTutorStep.action === 'merge') {
      // For merging group answers
      if (currentTutorStep.prompt.includes("add")) {
        const parts = currentTutorStep.prompt.match(/(\d+)\s*\+\s*(\d+)/);
        if (parts && parts.length >= 3) {
          const num1 = parseInt(parts[1]);
          const num2 = parseInt(parts[2]);
          isCorrect = answer === (num1 + num2);
        } else {
          isCorrect = answer === circles.length;
        }
      } else {
        isCorrect = answer === circles.length;
      }
    }
    
    if (isCorrect) {
      toast("Correct! 🎯", {
        description: "That's right!",
        duration: 2000,
      });
      
      // If this is a merge operation, automatically combine the groups with animation
      if (currentTutorStep.action === 'merge') {
        // First mark all circles as animating toward the center
        const centerX = 0;
        const centerY = 0;
        
        // Calculate how many circles we have from each sub-group
        const totalCircles = circles.length;
        
        // Calculate the positions in a circular or spiral pattern
        const calculateLayoutPositions = (total: number): [number, number, number][] => {
          const positions: [number, number, number][] = [];
          
          // For small groups, use a circle layout
          if (total <= 8) {
            const radius = Math.max(2, total * 0.5);
            const angleStep = (2 * Math.PI) / total;
            
            for (let i = 0; i < total; i++) {
              const angle = i * angleStep;
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              positions.push([x, y, 0]);
            }
          } 
          // For larger groups, use a spiral to prevent overlapping
          else {
            let angle = 0;
            const baseSpacing = 1.5;
            const spiralFactor = 0.3;
            let radius = baseSpacing;
            
            for (let i = 0; i < total; i++) {
              // Calculate position on spiral
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              positions.push([x, y, 0]);
              
              // Increment angle and radius for next circle
              angle += (2 * Math.PI) / (radius * 2);
              radius += spiralFactor / (2 * Math.PI);
            }
          }
          
          return positions;
        };
        
        const newPositions = calculateLayoutPositions(totalCircles);
        
        // Assign target positions to each circle for animation
        setCircles(prev => prev.map((circle, index) => ({
          ...circle,
          isAnimating: true,
          targetPosition: newPositions[index]
        })));
        
        // After a delay, actually combine the groups and finalize positions
        setTimeout(() => {
          combineAllGroups();
          
          // Turn all circles yellow to signify they're part of the same group
          // Keep the positions that were set earlier
          setCircles(prev => prev.map(circle => ({
            ...circle,
            color: GROUPED_CIRCLE_COLOR,
            isAnimating: false
          })));
        }, 1500);
      }
      
      // Notify parent of step completion
      onStepComplete(currentTutorStep.action, circles.length, true);
    } else {
      toast("Try again! 🤔", {
        description: "That's not the correct answer. Try counting again.",
        duration: 3000,
      });
      
      // Notify parent of incorrect answer
      onStepComplete(currentTutorStep.action, circles.length, false);
    }
  };
  
  // Determine if add circle button should be enabled
  const allowAddCircle = currentTutorStep.action === 'add';
  
  // Determine if answer input should be shown
  const allowAnswer = currentTutorStep.action === 'answer' || currentTutorStep.action === 'merge';
  
  // Format the current action as a status message
  const getCurrentStatus = (): string => {
    return currentTutorStep.prompt;
  };

  // Effects section
  // Reset circles when planet changes
  useEffect(() => {
    setCircles([]);
    setSelectedCircles([]);
    setNextId(1);
    setGroupedCircles({});
    setHighestProgress(0);
  }, [currentPlanetIndex]);
  
  // Handle tutor step actions
  useEffect(() => {
    if (currentTutorStep.action === 'group') {
      // Automatically group the selected circles
      if (selectedCircles.length >= 2) {
        createCircleGroup();
      } else {
        // Select all ungrouped circles if not enough are selected
        const ungroupedCircles = circles
          .filter(c => !groupedCircles[c.id])
          .map(c => c.id);
        
        if (ungroupedCircles.length >= 2) {
          setSelectedCircles(ungroupedCircles);
          setTimeout(() => createCircleGroup(), 500);
        }
      }
    }
  }, [currentTutorStep, selectedCircles.length, circles, groupedCircles, createCircleGroup]);
  
  // Calculate progress percentage - use highest value to prevent bar from shrinking
  const progressPercentage = Math.max(
    highestProgress, 
    Math.round((circles.length / targetCircleCount) * 100)
  );
  
  // Update highest progress
  useEffect(() => {
    const currentProgress = Math.round((circles.length / targetCircleCount) * 100);
    if (currentProgress > highestProgress) {
      setHighestProgress(currentProgress);
    }
  }, [circles.length, targetCircleCount, highestProgress]);

  // Rendering section
  return (
    <div className="flex flex-col h-full">
      {/* Visual status of current step */}
      <div className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg text-white font-medium text-center">
        {getCurrentStatus()}
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress: {circles.length} of {targetCircleCount} circles</span>
          <span className="text-sm font-medium">{currentPlanet.name}</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {/* Controls moved above the canvas */}
      <div className="mb-4">
        <MathToolbar 
          onAddCircle={addCircle}
          onCombineCircles={createCircleGroup}
          onReset={resetPlanet}
          onNextStep={() => {/* Next step is handled by the tutor */}}
          onAnswer={handleAnswer}
          currentPrompt={currentTutorStep.prompt}
          allowAddCircle={allowAddCircle}
          allowAnswer={allowAnswer}
          circleCount={circles.length}
          isLastPlanet={isLastPlanet}
          targetCircleCount={targetCircleCount}
          currentPlanetName={currentPlanet.name}
          planetHint={currentPlanet.hint}
          isComplete={circles.length >= targetCircleCount}
        />
      </div>
      
      {/* 3D Canvas with fixed height rather than vh-based */}
      <div className="rounded-lg overflow-hidden bg-gradient-to-b from-black to-indigo-950 shadow-xl" style={{ height: '500px', position: 'relative' }}>
        {/* Fallback message in case of Canvas errors */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <p className="text-white opacity-30">Interactive 3D Solar System</p>
        </div>
        
        <div className="relative z-10" style={{ height: '100%' }}>
          {(() => {
            try {
              return (
                <Canvas 
                  camera={{ position: [0, 0, 10], fov: 50 }}
                  gl={{ antialias: true }}
                  dpr={[1, 2]}
                  style={{ touchAction: 'none' }}
                >
                  <SceneContent 
                    circles={circles} 
                    selectedCircles={selectedCircles}
                    onCircleClick={handleCircleClick}
                    planetName={currentPlanet?.name || "Loading..."}
                    currentStep={0}
                    lastGroupCreated={lastGroupCreated}
                  />
                </Canvas>
              );
            } catch (error) {
              console.error("Canvas error:", error);
              return (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white">
                    Unable to load 3D scene. Please refresh the page or try a different browser.
                  </p>
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default MathScene;
