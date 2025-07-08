import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { BoxMethodProblem3D } from '@/utils/boxMethod3DExercises';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { SolarPanelReward } from './RewardVisuals';

// UI Components for the unit builder
const UnitButton = ({ 
  label, 
  value, 
  color, 
  onClick 
}: { 
  label: string; 
  value: number; 
  color: string; 
  onClick: () => void; 
}) => {
  return (
    <Button 
      onClick={onClick}
      className="flex items-center gap-2"
      style={{ backgroundColor: color, borderColor: color }}
    >
      {label}
    </Button>
  );
};

// Unit block for visualizing units
interface UnitBlockProps {
  position: [number, number, number];
  color: string;
  size: [number, number, number];
  value: number;
}

const UnitBlock = ({ position, color, size, value }: UnitBlockProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a constant rotation instead of animated rotation to avoid errors
  return (
    <mesh
      ref={meshRef}
      position={position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color={color}
        transparent
        opacity={0.85}
        roughness={0.5}
        metalness={0.3}
      />
      {value >= 10 && (
        <Text
          position={[0, 0, size[2] / 2 + 0.02]}
          fontSize={value >= 100 ? 0.15 : 0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {value.toString()}
        </Text>
      )}
    </mesh>
  );
};

// Grid cell component
interface BoxCellProps {
  position: [number, number, number];
  size: [number, number, number];
  rowFactor: number;
  colFactor: number;
  isSelected: boolean;
  isComplete: boolean;
  onClick: () => void;
  blocks: {
    value: number;
    count: number;
  color: string;
    size: [number, number, number];
  }[];
  totalBuilt: number;
}

const BoxCell = ({
  position, 
  size, 
  rowFactor,
  colFactor,
  isSelected,
  isComplete,
  onClick,
  blocks,
  totalBuilt
}: BoxCellProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const correctProduct = rowFactor * colFactor;
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Hover effect
    if (hovered && !isSelected) {
      meshRef.current.scale.set(1.02, 1.02, 1.02);
    } else if (!isSelected) {
      meshRef.current.scale.set(1, 1, 1);
    }
    
    // Selected effect
    if (isSelected) {
      meshRef.current.scale.set(1.05, 1.05, 1.05);
    }
    
    // Complete effect - subtle pulse
    if (isComplete) {
      const pulse = Math.sin(Date.now() * 0.003) * 0.05 + 1;
      meshRef.current.scale.setScalar(pulse);
    }
  });
  
  // Render the blocks inside the cell
  const renderBlocks = () => {
    const blockElements = [];
    let currentPosition: [number, number, number] = [
      position[0] - size[0] * 0.4, 
      position[1] - size[1] * 0.3, 
      position[2] + 0.05
    ];
    let currentRow = 0;
    let currentCol = 0;
    const maxBlocksPerRow = 6;
    
    blocks.forEach(blockType => {
      for (let i = 0; i < blockType.count; i++) {
        // Calculate position - stack in rows
        if (currentCol >= maxBlocksPerRow) {
          currentCol = 0;
          currentRow++;
          // Reset to start of new row
          currentPosition = [
            position[0] - size[0] * 0.4,
            position[1] - size[1] * 0.3 + (currentRow * blockType.size[1] * 1.2),
            currentPosition[2]
          ];
        }
        
        blockElements.push(
          <UnitBlock 
            key={`${blockType.value}-${i}`}
            position={currentPosition}
            color={blockType.color}
            size={blockType.size}
            value={blockType.value}
          />
        );
        
        // Move to next position in the current row
        currentPosition = [
          currentPosition[0] + blockType.size[0] * 1.2,
          currentPosition[1],
          currentPosition[2]
        ];
        currentCol++;
      }
      
      // Reset for next block type
      currentCol = 0;
      currentRow++;
      currentPosition = [
        position[0] - size[0] * 0.4,
        position[1] - size[1] * 0.3 + (currentRow * blocks[0].size[1] * 1.2),
        currentPosition[2]
      ];
    });
    
    return blockElements;
  };
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={isComplete ? '#a5d6a7' : isSelected ? '#bbdefb' : '#e3f2fd'}
          transparent
          opacity={0.7}
          roughness={0.8}
          emissive={isComplete ? '#4caf50' : isSelected ? '#2196f3' : '#000000'}
          emissiveIntensity={isComplete ? 0.3 : isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Product label */}
        <Text
        position={[
          position[0], 
          position[1] + size[1] * 0.4, 
          position[2] + 0.05
        ] as [number, number, number]}
        fontSize={0.25}
        color={isComplete ? "green" : "black"}
          anchorX="center"
        anchorY="bottom"
        >
        {`${rowFactor} × ${colFactor}`}
        </Text>
      
      {/* Current total - Only show blocks placed, not correct/incorrect judgment */}
      <Text
        position={[
          position[0], 
          position[1], 
          position[2] + size[2] + 0.1
        ] as [number, number, number]}
        fontSize={0.3}
        color={isComplete ? "green" : totalBuilt > correctProduct ? "red" : "blue"}
        anchorX="center"
        anchorY="middle"
      >
        {isComplete ? "Complete! ✓" : `Blocks: ${totalBuilt}`}
      </Text>
      
      {/* Render all blocks */}
      {renderBlocks()}
    </group>
  );
};

// Grid component
interface BoxGridProps {
  problem: BoxMethodProblem3D;
  selectedCell: number | null;
  completedCells: number[];
  onCellClick: (index: number) => void;
  cellTotals: number[];
  cellBlocks: {
    value: number;
    count: number;
    color: string;
    size: [number, number, number];
  }[][];
}

const BoxGrid = ({
  problem,
  selectedCell,
  completedCells,
  onCellClick,
  cellTotals,
  cellBlocks
}: BoxGridProps) => {
  const { 
    placeValueDecomposition,
    boxGrid,
    sumStep
  } = problem;
  
  // Grid dimensions
  const gridSize = 2;
  const cellSize: [number, number, number] = [3, 2, 0.05];
  const spacing = 3.5;
  
  // Build grid cells
  const renderCells = () => {
    const cells = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        
        // Create the position as a tuple with explicit x, y, z values
        const x = col * spacing - spacing / 2;
        const y = -row * spacing + spacing / 2;
        const z = 0;
        const cellPos: [number, number, number] = [x, y, z];
        
        const rowFactor = placeValueDecomposition.firstNumber[row];
        const colFactor = placeValueDecomposition.secondNumber[col];
        
        cells.push(
          <BoxCell 
            key={`cell-${row}-${col}`}
            position={cellPos}
            size={cellSize}
            rowFactor={rowFactor}
            colFactor={colFactor}
            isSelected={selectedCell === index}
            isComplete={completedCells.includes(index)}
            onClick={() => onCellClick(index)}
            blocks={cellBlocks[index] || []}
            totalBuilt={cellTotals[index]}
          />
        );
      }
    }
    
    return cells;
  };
  
  // Draw grid lines
  const renderGridLines = () => {
    const lineWidth = gridSize * spacing;
    const lines = [];
    
    // Use simple mesh lines instead
    // Horizontal lines
    for (let i = 0; i <= gridSize; i++) {
      const yPos = i * -spacing + spacing;
      lines.push(
        <mesh key={`h-line-${i}`} position={[0, yPos, -0.01] as [number, number, number]}>
          <boxGeometry args={[lineWidth, 0.02, 0.01]} />
          <meshBasicMaterial color="#9e9e9e" />
        </mesh>
      );
    }
    
    // Vertical lines
    for (let i = 0; i <= gridSize; i++) {
      const xPos = i * spacing - lineWidth / 2;
      lines.push(
        <mesh key={`v-line-${i}`} position={[xPos, 0, -0.01] as [number, number, number]}>
          <boxGeometry args={[0.02, lineWidth, 0.01]} />
          <meshBasicMaterial color="#9e9e9e" />
        </mesh>
      );
    }
    
    return lines;
  };
  
  // Render axis labels
  const renderAxisLabels = () => {
    const labels = [];
    const { firstNumber, secondNumber } = placeValueDecomposition;
    
    // Row labels (left side)
    firstNumber.forEach((value, i) => {
      labels.push(
        <Text
          key={`row-${i}`}
          position={[-spacing - 0.5, -i * spacing + spacing/2, 0] as [number, number, number]}
          fontSize={0.35}
          color="#333333"
          anchorX="right"
          anchorY="middle"
        >
          {value}
        </Text>
      );
    });
    
    // Column labels (top)
    secondNumber.forEach((value, i) => {
      labels.push(
    <Text
          key={`col-${i}`}
          position={[i * spacing - spacing/2, spacing + 0.5, 0] as [number, number, number]}
      fontSize={0.35}
          color="#333333"
          anchorX="center"
      anchorY="middle"
    >
          {value}
    </Text>
  );
    });
    
    return labels;
  };
  
  // Render the result sum display - remove direct total value display
  const renderSum = () => {
    const allComplete = completedCells.length === 4;
    
    if (!allComplete) return null;
  
  return (
      <group position={[0, -spacing * 2 - 0.5, 0.5] as [number, number, number]}>
      <Text
          fontSize={0.5}
          color="#2e7d32"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
          {"You did it! The solar panels are complete!"}
      </Text>
      </group>
    );
  };
  
  return (
    <group>
      {/* Background grid */}
      <gridHelper args={[15, 15, '#e0e0e0', '#f5f5f5']} rotation={[Math.PI / 2, 0, 0] as [number, number, number]} position={[0, 0, -0.05] as [number, number, number]} />
      
      {/* Grid cells */}
      {renderCells()}
      
      {/* Grid lines */}
      {renderGridLines()}
      
      {/* Axis labels */}
      {renderAxisLabels()}
      
      {/* Sum result */}
      {renderSum()}
    </group>
  );
};

// Scene setup components
const SceneSetup = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  
  return null;
};

const CameraController = () => {
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={true}
      minDistance={5}
      maxDistance={20}
      minPolarAngle={0}
      maxPolarAngle={Math.PI/2}
      rotateSpeed={0.5}
      zoomSpeed={0.5}
      enableDamping={true}
      dampingFactor={0.1}
    />
  );
};

// Main BoxMethod component
interface BoxMethod3DProps {
  problem: BoxMethodProblem3D; 
  onComplete?: (success: boolean) => void;
  onRevealBox?: (index: number, value: number) => void;
  showReward?: boolean;
}

const BoxMethod3D = ({ problem, onComplete = () => {}, onRevealBox, showReward = false }: BoxMethod3DProps) => {
  // State for the interactive grid
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [completedCells, setCompletedCells] = useState<number[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  
  // Initialize block data with defined values for all cells
  const initialBlocks = Array(4).fill(0).map(() => [
    { value: 100, count: 0, color: '#3f51b5', size: [0.6, 0.6, 0.25] as [number, number, number] },
    { value: 10, count: 0, color: '#4caf50', size: [0.4, 0.4, 0.2] as [number, number, number] },
    { value: 1, count: 0, color: '#ff9800', size: [0.2, 0.2, 0.15] as [number, number, number] },
  ]);
  
  // State for tracking block counts for each cell
  const [cellBlocks, setCellBlocks] = useState(initialBlocks);
  
  // Calculate the total built for each cell
  const cellTotals = cellBlocks.map(blocks => 
    blocks.reduce((sum, block) => sum + block.value * block.count, 0)
  );
  
  // Handle cell selection
  const handleCellClick = (index: number) => {
    if (completedCells.includes(index)) {
      // Cell is already completed, don't select it
      return;
    }
    
    setSelectedCell(index);
    
    const rowFactor = problem.boxGrid[index].rowLabel;
    const colFactor = problem.boxGrid[index].columnLabel;
    
    toast.info(`Building ${rowFactor} groups of ${colFactor}`, {
      duration: 2000
    });
  };
  
  // Add a block to the selected cell
  const handleAddBlock = (blockValue: number) => {
    if (selectedCell === null) return;
    
    setCellBlocks(prev => {
      const newBlocks = [...prev];
      const cellBlockTypes = [...newBlocks[selectedCell]];
      
      // Find the block type and increment its count
      const blockIndex = cellBlockTypes.findIndex(b => b.value === blockValue);
      if (blockIndex !== -1) {
        cellBlockTypes[blockIndex] = {
          ...cellBlockTypes[blockIndex],
          count: cellBlockTypes[blockIndex].count + 1
        };
      }
      
      newBlocks[selectedCell] = cellBlockTypes;
      return newBlocks;
    });
  };
  
  // Reset the selected cell
  const handleResetCell = () => {
    if (selectedCell === null) return;
    
    setCellBlocks(prev => {
      const newBlocks = [...prev];
      const cellBlockTypes = newBlocks[selectedCell].map(block => ({
        ...block,
        count: 0
      }));
      
      newBlocks[selectedCell] = cellBlockTypes;
      return newBlocks;
    });
    
    toast.info("Blocks cleared. Try again!", {
      duration: 1500
    });
  };
  
  // Check if the cell is correct
  const handleCheckCell = () => {
    if (selectedCell === null) return;
    
    const correctProduct = problem.boxGrid[selectedCell].product;
    const builtProduct = cellTotals[selectedCell];
    const rowFactor = problem.boxGrid[selectedCell].rowLabel;
    const colFactor = problem.boxGrid[selectedCell].columnLabel;
    
    if (builtProduct === correctProduct) {
      // Correct! Mark cell as completed
      setCompletedCells(prev => [...prev, selectedCell]);
      
      // Notify parent component
      if (onRevealBox) {
        onRevealBox(selectedCell, correctProduct);
      }
      
      // Provide non-revealing congratulatory messages
      const completionMessages = [
        "Perfect! This cell is complete!",
        "Great work! You've found the right blocks!",
        "Excellent job building this cell!",
        "You've figured it out! Well done!"
      ];
      
      toast.success(completionMessages[Math.floor(Math.random() * completionMessages.length)], {
        duration: 2000
      });
      
      // Clear selection after delay
      setTimeout(() => {
        setSelectedCell(null);
      }, 1000);
      
      // All cells completed?
      if (completedCells.length === 3) { // This is the last cell (4 total including current)
        setTimeout(() => {
          onComplete(true);
        }, 1500);
      }
    } else if (builtProduct > correctProduct) {
      // Too many blocks
      const difference = builtProduct - correctProduct;
      let message = "Too many blocks!";
      
      // Fuzzy feedback based on how far off they are
      if (difference >= 100) {
        message += " Try removing a 100-block.";
      } else if (difference >= 50) {
        message += " Try removing some larger blocks.";
      } else if (difference >= 10) {
        message += " Try removing a 10-block.";
      } else {
        message += " Remove a few 1-blocks.";
      }
      
      toast.error(message, {
        duration: 2000
      });
      setAttempts(prev => prev + 1);
    } else {
      // Not enough blocks
      const difference = correctProduct - builtProduct;
      let message = "Not enough blocks!";
      
      // Fuzzy feedback
      if (difference >= 100) {
        message += " Try adding more 100-blocks.";
      } else if (difference >= 50) {
        message += " You need more large blocks.";
      } else if (difference >= 10) {
        message += " Try adding another 10-block.";
      } else {
        message += " Add a few more 1-blocks.";
      }
      
      toast.error(message, {
        duration: 2000
      });
      setAttempts(prev => prev + 1);
      
      // Give hint after multiple attempts
      if (attempts >= 2) {
        // More discovery-based hints
        const hints = [
          `Think of ${rowFactor} groups of ${colFactor}. What's that total?`,
          `How many ${colFactor}s would make ${rowFactor} groups?`,
          `Try breaking down ${rowFactor} × ${colFactor} into smaller steps.`
        ];
        
        setFeedbackMsg(hints[Math.floor(Math.random() * hints.length)]);
      }
    }
  };
  
  // Render unit builder UI
  const renderUnitBuilder = () => {
    if (selectedCell === null) return null;
    
    const rowFactor = problem.boxGrid[selectedCell].rowLabel;
    const colFactor = problem.boxGrid[selectedCell].columnLabel;
  
  return (
      <div className="p-4 bg-white rounded-md shadow-md border border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-800">
          Building {rowFactor} × {colFactor}
        </h3>
        
        <p className="text-sm mb-4">
          What blocks do you need for {rowFactor} groups of {colFactor}?
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <UnitButton 
            label="Add 100-block" 
            value={100} 
            color="#3f51b5" 
            onClick={() => handleAddBlock(100)} 
          />
          <UnitButton 
            label="Add 10-block" 
            value={10} 
            color="#4caf50" 
            onClick={() => handleAddBlock(10)} 
          />
          <UnitButton 
            label="Add 1-block" 
            value={1} 
            color="#ff9800" 
            onClick={() => handleAddBlock(1)} 
          />
        </div>
        
        <div className="flex gap-2 justify-between">
          <Button 
            onClick={handleResetCell}
            variant="outline"
            className="flex items-center gap-1"
          >
            🔄 Reset
          </Button>
          
                <Button 
            onClick={handleCheckCell}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                >
            ✓ Check
                </Button>
              </div>
        
        <div className="mt-4 text-center">
          <span className="font-medium">Current Total: </span>
          <span className={cellTotals[selectedCell] > problem.boxGrid[selectedCell].product ? 'text-red-600 font-bold' : 'text-blue-600 font-bold'}>
            {cellTotals[selectedCell]}
          </span>
          {cellTotals[selectedCell] > problem.boxGrid[selectedCell].product && 
            <p className="text-xs text-red-600 mt-1">Too many blocks! Try resetting.</p>
          }
        </div>
        
        {attempts >= 2 && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            <p>Hint: Think about what {rowFactor} × {colFactor} equals.</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-[500px] border border-gray-300 rounded-md overflow-hidden bg-gray-50 shadow-inner">
          <Canvas
            shadows
            camera={{ position: [0, 0, 10], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 10]} intensity={0.8} castShadow />
            
            <BoxGrid 
              problem={problem}
              selectedCell={selectedCell}
              completedCells={completedCells}
              onCellClick={handleCellClick}
              cellTotals={cellTotals}
              cellBlocks={cellBlocks}
            />
            
            <CameraController />
            <SceneSetup />
          </Canvas>
        </div>
        
        <div className="md:col-span-1">
          {selectedCell !== null ? (
            renderUnitBuilder()
          ) : (
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
              <ol className="list-decimal pl-5 text-sm space-y-2">
                <li>Click on a grid cell to start building</li>
                <li>Use the buttons to add different sized blocks</li>
                <li>Build the correct product for each cell</li>
                <li>Complete all 4 cells to solve the problem</li>
              </ol>
              
              {completedCells.length > 0 && (
                <div className="mt-4 p-2 bg-green-50 rounded border border-green-200">
                  <p className="text-green-800 font-medium">
                    Progress: {completedCells.length}/4 cells completed
                    {completedCells.length === 1 && " - Great start!"}
                    {completedCells.length === 2 && " - Halfway there!"}
                    {completedCells.length === 3 && " - Almost done!"}
                  </p>
                </div>
              )}
              
              {feedbackMsg && (
                <div className="mt-4 p-2 bg-amber-50 rounded border border-amber-200">
                  <p className="text-amber-800 font-medium">
                    Hint: {feedbackMsg}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-sm bg-blue-50 p-3 rounded-md border border-blue-100">
        <p className="font-medium">What to do:</p>
        <p className="mt-1">
          Use this interactive box to solve {problem.problem}. 
          Click each grid cell and build the partial products by adding blocks.
          When you complete all cells, you'll power the school's solar panels!
        </p>
      </div>
    </div>
  );
};

export default BoxMethod3D;

