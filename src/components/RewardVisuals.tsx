import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Solar Panel Reward Component
export const SolarPanelReward = ({ rotate = false }: { rotate?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current || !rotate) return;
    groupRef.current.rotation.y += 0.01;
  });
  
  // Solar array reward
  const renderSolarArray = () => {
    const panels = [];
    const panelSize = [0.4, 0.6, 0.05];
    const rows = 5;
    const cols = 8;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xPos = c * 0.5 - (cols * 0.5 / 2);
        const zPos = r * 0.7 - (rows * 0.7 / 2);
        
        // Panel base (frame)
        panels.push(
          <mesh key={`panel-frame-${r}-${c}`} position={[xPos, 0, zPos]} rotation={[-Math.PI/6, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[panelSize[0] + 0.05, panelSize[1] + 0.05, 0.02, 1, 1, 1]} />
            <meshStandardMaterial color="#9e9e9e" metalness={0.6} roughness={0.4} />
          </mesh>
        );
        
        // Panel solar cells with blue gradient texture
        panels.push(
          <mesh key={`panel-${r}-${c}`} position={[xPos, 0.015, zPos]} rotation={[-Math.PI/6, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[panelSize[0], panelSize[1], panelSize[2], 1, 1, 1]} />
            <meshPhysicalMaterial 
              color="#1e3a8a" 
              metalness={0.9} 
              roughness={0.2} 
              clearcoat={1}
              clearcoatRoughness={0.1}
              reflectivity={0.8}
            />
          </mesh>
        );
        
        // Add subtle grid pattern for solar cells
        const cellSize = 0.08;
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 6; j++) {
            const cellX = xPos - panelSize[0]/2 + cellSize/2 + i * cellSize;
            const cellZ = zPos - panelSize[1]/2 + cellSize/2 + j * cellSize;
            
            panels.push(
              <mesh key={`cell-${r}-${c}-${i}-${j}`} position={[cellX, 0.02, cellZ]} rotation={[-Math.PI/6, 0, 0]}>
                <boxGeometry args={[cellSize - 0.01, cellSize - 0.01, 0.01, 1, 1, 1]} />
                <meshPhysicalMaterial 
                  color="#0c4a6e" 
                  metalness={0.9} 
                  roughness={0.1}
                  envMapIntensity={1.5}
                  transmission={0.1}
                />
              </mesh>
            );
          }
        }
      }
    }
    
    // Add ground beneath panels
    panels.push(
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} />
      </mesh>
    );
    
    // Add support posts for panels
    for (let r = 0; r < rows; r += 2) {
      for (let c = 0; c < cols; c += 3) {
        const xPos = c * 0.5 - (cols * 0.5 / 2);
        const zPos = r * 0.7 - (rows * 0.7 / 2);
        
        panels.push(
          <mesh key={`post-${r}-${c}`} position={[xPos, -0.25, zPos]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
          </mesh>
        );
      }
    }
    
    // Add rays of sun shining on panels
    panels.push(
      <mesh position={[3, 3, 2]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffeb3b" />
      </mesh>
    );
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const length = 0.8;
      panels.push(
        <mesh key={`ray-${i}`} position={[
          3 + Math.cos(angle) * (0.5 + length/2),
          3 + Math.sin(angle) * (0.5 + length/2),
          2
        ]} rotation={[0, 0, angle]}>
          <boxGeometry args={[length, 0.1, 0.05]} />
          <meshBasicMaterial color="#ffeb3b" />
        </mesh>
      );
    }
    
    return panels;
  };
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {renderSolarArray()}
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#f9a825"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Great work! You've powered a solar farm!
      </Text>
    </group>
  );
};

// Tree Planting Reward Component
export const TreePlantingReward = ({ rotate = false }: { rotate?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current || !rotate) return;
    groupRef.current.rotation.y += 0.01;
  });
  
  // Forest reward
  const renderForest = () => {
    const elements = [];
    const rows = 4;
    const cols = 4;
    
    // Create a ground
    elements.push(
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </mesh>
    );
    
    // Create trees
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xPos = c * 1.5 - (cols * 1.5 / 2) + Math.random() * 0.5;
        const zPos = r * 1.5 - (rows * 1.5 / 2) + Math.random() * 0.5;
        const scale = 0.5 + Math.random() * 0.5;
        const treeHeight = 1 + Math.random() * 0.5;
        
        // Tree trunk
        elements.push(
          <mesh key={`trunk-${r}-${c}`} position={[xPos, 0, zPos]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, treeHeight, 8]} />
            <meshStandardMaterial color="#795548" roughness={0.8} />
          </mesh>
        );
        
        // Tree foliage (multiple layers)
        const layers = 3;
        for (let i = 0; i < layers; i++) {
          const height = treeHeight / 2 + i * 0.4;
          const size = 0.8 - i * 0.15;
          
          elements.push(
            <mesh key={`foliage-${r}-${c}-${i}`} position={[xPos, height, zPos]} castShadow>
              <coneGeometry args={[size * scale, size * scale, 8]} />
              <meshStandardMaterial 
                color={i % 2 === 0 ? "#2e7d32" : "#388e3c"} 
                roughness={0.7} 
              />
            </mesh>
          );
        }
      }
    }
    
    // Add a sun
    elements.push(
      <mesh position={[3, 4, -3]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffeb3b" />
      </mesh>
    );
    
    // Add clouds
    for (let i = 0; i < 5; i++) {
      const xPos = -5 + i * 2.5;
      const yPos = 3 + Math.random();
      const zPos = -4 + Math.random() * 2;
      const scale = 0.6 + Math.random() * 0.4;
      
      elements.push(
        <group key={`cloud-${i}`} position={[xPos, yPos, zPos]}>
          <mesh castShadow>
            <sphereGeometry args={[0.4 * scale, 16, 16]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          <mesh position={[0.3, 0, 0]} castShadow>
            <sphereGeometry args={[0.3 * scale, 16, 16]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          <mesh position={[-0.3, 0, 0]} castShadow>
            <sphereGeometry args={[0.35 * scale, 16, 16]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.35 * scale, 16, 16]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
        </group>
      );
    }
    
    // Add wildlife (birds)
    for (let i = 0; i < 3; i++) {
      const xPos = -2 + i * 2;
      const yPos = 2.5 + Math.random() * 0.5;
      const zPos = -2 - Math.random();
      
      elements.push(
        <group key={`bird-${i}`} position={[xPos, yPos, zPos]}>
          <mesh>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#607d8b" />
          </mesh>
          <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.16, 0.02, 0.1]} />
            <meshStandardMaterial color="#607d8b" />
          </mesh>
          <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.16, 0.02, 0.1]} />
            <meshStandardMaterial color="#607d8b" />
          </mesh>
        </group>
      );
    }
    
    return elements;
  };
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {renderForest()}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="#ff6d00"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Great work! You've planted a forest!
      </Text>
    </group>
  );
};

// Household Reward Component
export const HouseholdReward = ({ rotate = false }: { rotate?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current || !rotate) return;
    groupRef.current.rotation.y += 0.01;
  });
  
  // Neighborhood reward
  const renderNeighborhood = () => {
    const elements = [];
    const rows = 3;
    const cols = 4;
    
    // Create a ground
    elements.push(
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#81c784" roughness={0.8} />
      </mesh>
    );
    
    // Create houses in a neighborhood
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xPos = c * 2.5 - (cols * 2.5 / 2) + Math.random() * 0.2;
        const zPos = r * 2.5 - (rows * 2.5 / 2) + Math.random() * 0.2;
        
        // House base colors - friendly neighborhood colors
        const houseColors = ["#bbdefb", "#ffcdd2", "#e1bee7", "#c8e6c9", "#ffe0b2", "#d1c4e9"];
        const roofColors = ["#d50000", "#6a1b9a", "#1a237e", "#1b5e20", "#e65100"];
        
        const houseColor = houseColors[Math.floor(Math.random() * houseColors.length)];
        const roofColor = roofColors[Math.floor(Math.random() * roofColors.length)];
        
        // House base
        elements.push(
          <mesh key={`house-${r}-${c}`} position={[xPos, 0.5, zPos]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={houseColor} roughness={0.7} />
          </mesh>
        );
        
        // House roof
        elements.push(
          <mesh key={`roof-${r}-${c}`} position={[xPos, 1.1, zPos]} rotation={[0, Math.PI/4, 0]} castShadow>
            <coneGeometry args={[1, 0.7, 4]} />
            <meshStandardMaterial color={roofColor} roughness={0.5} />
          </mesh>
        );
        
        // Windows
        elements.push(
          <mesh key={`window1-${r}-${c}`} position={[xPos - 0.3, 0.5, zPos + 0.51]} castShadow>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshPhysicalMaterial 
              color="#fff9c4" 
              roughness={0.1} 
              clearcoat={1}
              transmission={0.3}
            />
          </mesh>
        );
        
        elements.push(
          <mesh key={`window2-${r}-${c}`} position={[xPos + 0.3, 0.5, zPos + 0.51]} castShadow>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshPhysicalMaterial 
              color="#fff9c4" 
              roughness={0.1} 
              clearcoat={1}
              transmission={0.3}
            />
          </mesh>
        );
        
        // Door
        elements.push(
          <mesh key={`door-${r}-${c}`} position={[xPos, 0.3, zPos + 0.51]} castShadow>
            <boxGeometry args={[0.3, 0.6, 0.02]} />
            <meshStandardMaterial color="#4e342e" roughness={0.8} />
          </mesh>
        );
        
        // Add power lines connecting houses
        if (c < cols - 1) {
          elements.push(
            <mesh key={`powerline-h-${r}-${c}`} position={[xPos + 1.25, 1.6, zPos]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
              <meshStandardMaterial color="#212121" roughness={0.8} />
            </mesh>
          );
        }
        
        if (r < rows - 1) {
          elements.push(
            <mesh key={`powerline-v-${r}-${c}`} position={[xPos, 1.6, zPos + 1.25]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 2.5, 8]} />
              <meshStandardMaterial color="#212121" roughness={0.8} />
            </mesh>
          );
        }
        
        // Power poles
        elements.push(
          <mesh key={`pole-${r}-${c}`} position={[xPos + 1, 0.8, zPos + 1]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 8]} />
            <meshStandardMaterial color="#5d4037" roughness={0.8} />
          </mesh>
        );
      }
    }
    
    // Add sun with energy rays
    elements.push(
      <mesh position={[4, 3, -3]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffeb3b" />
      </mesh>
    );
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const length = 0.8;
      elements.push(
        <mesh key={`sunray-${i}`} position={[
          4 + Math.cos(angle) * (0.5 + length/2),
          3 + Math.sin(angle) * (0.5 + length/2),
          -3
        ]} rotation={[0, 0, angle]}>
          <boxGeometry args={[length, 0.1, 0.05]} />
          <meshBasicMaterial color="#ffeb3b" />
        </mesh>
      );
    }
    
    // Add energy flow animations (electric current flow)
    for (let i = 0; i < 5; i++) {
      const xPos = -4 + i * 2;
      const yPos = 2.5;
      const zPos = -2;
      
      elements.push(
        <mesh key={`energy-${i}`} position={[xPos, yPos, zPos]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#2196f3" emissive="#2196f3" emissiveIntensity={2} />
        </mesh>
      );
    }
    
    return elements;
  };
  
  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      {renderNeighborhood()}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#1565c0"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Great work! You've powered a community!
      </Text>
    </group>
  );
}; 