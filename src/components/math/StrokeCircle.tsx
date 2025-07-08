import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface StrokeCircleProps {
  position: [number, number, number];
  radius: number;
  color: string;
  showCount?: boolean;
  count?: number;
  groupRadius?: number;
  pulse?: boolean;
}

const StrokeCircle: React.FC<StrokeCircleProps> = ({ 
  position, 
  radius, 
  color,
  showCount = false,
  count = 0,
  groupRadius = 0,
  pulse = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const rotationSpeed = 0.2;
  const [scaleValue, setScaleValue] = useState(1);
  const [pulseDirection, setPulseDirection] = useState(1);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += rotationSpeed * 0.01;
    }
    
    // Add pulsing animation if enabled
    if (pulse && ringRef.current) {
      // Update the scale value for pulsing
      const newScale = scaleValue + delta * pulseDirection * 0.5;
      
      // Reverse direction when reaching limits
      if (newScale > 1.1) {
        setPulseDirection(-1);
      } else if (newScale < 0.95) {
        setPulseDirection(1);
      }
      
      setScaleValue(Math.max(0.95, Math.min(1.1, newScale)));
      ringRef.current.scale.set(scaleValue, scaleValue, scaleValue);
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh ref={ringRef}>
          <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </group>
      
      {showCount && count > 0 && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={radius * 0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {count}
        </Text>
      )}
    </group>
  );
};

export default StrokeCircle; 