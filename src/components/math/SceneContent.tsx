import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveCircle from './InteractiveCircle';
import StrokeCircle from './StrokeCircle';
import { getPlanetColor } from '@/utils/solarSystemData';
import { GROUPED_CIRCLE_COLOR } from './MathScene';

interface Circle {
  id: number;
  position: [number, number, number];
  color: string;
  isAnimating?: boolean;
  targetPosition?: [number, number, number];
  group?: number;
  isNew?: boolean;
}

interface SceneContentProps {
  circles: Circle[];
  selectedCircles: number[];
  onCircleClick: (id: number) => void;
  planetName: string;
  currentStep: number;
  lastGroupCreated: number | null;
}

const SceneContent: React.FC<SceneContentProps> = ({ 
  circles, 
  selectedCircles, 
  onCircleClick,
  planetName,
  currentStep,
  lastGroupCreated
}) => {
  const { camera, gl } = useThree();

  // Set up event handlers for better touch interaction
  useEffect(() => {
    const canvas = gl.domElement;
    
    // Make sure the canvas is accessible for interaction
    if (canvas) {
      canvas.style.touchAction = 'none';
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [gl]);

  const getGroupBounds = () => {
    if (selectedCircles.length >= 2) {
      const selectedCircleObjects = circles.filter(c => selectedCircles.includes(c.id));
      
      if (selectedCircleObjects.length >= 2) {
        const center: [number, number, number] = [0, 0, 0];
        selectedCircleObjects.forEach(circle => {
          const pos = circle.targetPosition || circle.position;
          center[0] += pos[0];
          center[1] += pos[1];
          center[2] += pos[2];
        });
        
        center[0] /= selectedCircleObjects.length;
        center[1] /= selectedCircleObjects.length;
        center[2] = 0;

        const radius = Math.max(2, Math.sqrt(selectedCircleObjects.length) * 0.8);
        return { center, radius };
      }
    }
    return null;
  };

  const getGroupedCircles = () => {
    const groups: {[key: number]: Circle[]} = {};
    let maxGroupRadius = 0;
    
    // First, organize circles into their groups
    circles.forEach(circle => {
      if (circle.group !== undefined) {
        if (!groups[circle.group]) {
          groups[circle.group] = [];
        }
        groups[circle.group].push(circle);
      }
    });
    
    // Calculate centers and radii for each group
    Object.entries(groups).forEach(([groupId, groupCircles]) => {
      const center: [number, number, number] = [0, 0, 0];
      groupCircles.forEach(c => {
        const pos = c.targetPosition || c.position;
        center[0] += pos[0];
        center[1] += pos[1];
        center[2] += pos[2];
      });
      
      center[0] /= groupCircles.length;
      center[1] /= groupCircles.length;
      center[2] = 0;

      let radius = 0;
      groupCircles.forEach(c => {
        const pos = c.targetPosition || c.position;
        const distance = Math.sqrt(
          Math.pow(pos[0] - center[0], 2) + 
          Math.pow(pos[1] - center[1], 2)
        );
        radius = Math.max(radius, distance);
      });
      
      maxGroupRadius = Math.max(maxGroupRadius, radius + 2);
      
      // Update the group object with the center and radius
      groups[groupId] = groupCircles;
    });
    
    return { groups, maxGroupRadius };
  };
  
  const { groups, maxGroupRadius } = getGroupedCircles();
  const groupBounds = getGroupBounds();
  
  // Check if there are any new groups (for recent additions)
  const newGroups = Object.entries(groups).filter(
    ([groupId, groupCircles]) => 
      groupCircles.some(c => c.isNew) && 
      groupId !== '1' && // Main group has ID 1
      parseInt(groupId) === lastGroupCreated
  );

  // Handler to handle clicks on the background
  const handleBackgroundClick = (event: any) => {
    // Stop propagation to prevent other events
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />
      <OrbitControls 
        enableZoom={true} 
        enablePan={false}
        enableRotate={true}
        minDistance={5}
        maxDistance={15}
      />
      
      {/* Create an invisible background plane to ensure click events work */}
      <mesh 
        position={[0, 0, -0.5]} 
        onClick={handleBackgroundClick}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <group position={[0, 0, 0]}>
        {/* Render main group wrappers */}
        {Object.entries(groups).map(([groupId, groupCircles]) => {
          // Skip rendering wrapper for new groups (they'll be rendered separately)
          if (groupId !== '1' && groupCircles.some(c => c.isNew) && parseInt(groupId) === lastGroupCreated) {
            return null;
          }
          
          const center: [number, number, number] = [0, 0, 0];
          groupCircles.forEach(circle => {
            const pos = circle.targetPosition || circle.position;
            center[0] += pos[0];
            center[1] += pos[1];
            center[2] += pos[2];
          });
          
          center[0] /= groupCircles.length;
          center[1] /= groupCircles.length;
          center[2] = 0;

          const radius = Math.max(2, Math.sqrt(groupCircles.length) * 0.8) + 1.2;
          
          return (
            <StrokeCircle 
              key={`group-${groupId}`}
              position={center}
              radius={radius}
              color={GROUPED_CIRCLE_COLOR} // Always use yellow for groups
              showCount={true}
              count={groupCircles.length}
              groupRadius={maxGroupRadius}
            />
          );
        })}
        
        {/* Render new groups (newly added circles) with different color wrapper */}
        {newGroups.map(([groupId, groupCircles]) => {
          const center: [number, number, number] = [0, 0, 0];
          groupCircles.forEach(circle => {
            const pos = circle.targetPosition || circle.position;
            center[0] += pos[0];
            center[1] += pos[1];
            center[2] += pos[2];
          });
          
          center[0] /= groupCircles.length;
          center[1] /= groupCircles.length;
          center[2] = 0;

          const radius = Math.max(2, Math.sqrt(groupCircles.length) * 0.8) + 1.2;
          
          // Use a different color for new groups to distinguish them
          return (
            <StrokeCircle 
              key={`new-group-${groupId}`}
              position={center}
              radius={radius}
              color={getPlanetColor(planetName)} // Use planet color for new groups
              showCount={true}
              count={groupCircles.length}
              groupRadius={maxGroupRadius}
              pulse={true} // Add pulse animation for new groups
            />
          );
        })}
        
        {/* Render selection wrapper */}
        {groupBounds && (
          <StrokeCircle 
            position={groupBounds.center}
            radius={groupBounds.radius + 1.2}
            color={getPlanetColor(planetName)} // Use planet color for selection
            showCount={true}
            count={selectedCircles.length}
            groupRadius={maxGroupRadius}
          />
        )}
        
        {/* Render all circles */}
        {circles.map((circle) => (
          <InteractiveCircle
            key={circle.id}
            position={circle.position}
            color={circle.color} // Use the circle's color which may be yellow for grouped circles
            onClick={() => onCircleClick(circle.id)}
            isSelected={selectedCircles.includes(circle.id)}
            isAnimating={circle.isAnimating}
            targetPosition={circle.targetPosition}
            inGroup={circle.group !== undefined}
          />
        ))}

        <Text
          position={[0, -1.7, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {planetName}
        </Text>
      </group>

      {/* Render stars in the background */}
      {Array.from({ length: 300 }).map((_, i) => {
        const position: [number, number, number] = [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          -10
        ];
        return (
          <mesh key={`star-${i}`} position={position}>
            <sphereGeometry args={[0.03 * Math.random(), 6, 6]} />
            <meshBasicMaterial color="white" />
          </mesh>
        );
      })}

      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0529" transparent opacity={0.7} />
      </mesh>
    </>
  );
};

export default SceneContent;
