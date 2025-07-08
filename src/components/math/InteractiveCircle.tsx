
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveCircleProps {
  position: [number, number, number];
  color: string;
  onClick: () => void;
  isSelected: boolean;
  isAnimating?: boolean;
  targetPosition?: [number, number, number];
  inGroup?: boolean;
}

const InteractiveCircle: React.FC<InteractiveCircleProps> = ({
  position,
  color,
  onClick,
  isSelected,
  isAnimating = false,
  targetPosition,
  inGroup = false
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentPosition, setCurrentPosition] = useState(position);
  const positionRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const targetRef = useRef<THREE.Vector3 | null>(null);
  
  // Update target position when it changes
  useEffect(() => {
    if (targetPosition) {
      targetRef.current = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
    }
  }, [targetPosition]);
  
  // Update current position when initial position changes and not animating
  useEffect(() => {
    if (!isAnimating) {
      positionRef.current.set(position[0], position[1], position[2]);
      setCurrentPosition(position);
      if (meshRef.current) {
        meshRef.current.position.set(position[0], position[1], position[2]);
      }
    }
  }, [position, isAnimating]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Handle animation to target position
    if (isAnimating && targetRef.current) {
      // Use an easing function for smoother animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const animationSpeed = 0.07; // Lower values = slower animation
      
      // Calculate normalized distance to target (0-1)
      const distance = meshRef.current.position.distanceTo(targetRef.current);
      const normalizedDistance = Math.min(1, distance);
      
      // Apply easing to the lerp factor
      const lerpFactor = easeOutCubic(animationSpeed) * normalizedDistance;
      
      // Apply lerp with the adjusted factor
      meshRef.current.position.lerp(targetRef.current, lerpFactor);
      
      // Update the position ref to match the mesh
      positionRef.current.copy(meshRef.current.position);
      
      // Snap to target if very close
      if (distance < 0.05) {
        meshRef.current.position.copy(targetRef.current);
        positionRef.current.copy(targetRef.current);
      }
    }
    
    // Visual effects for hover and selection
    if (isSelected) {
      // Use delta time for more consistent animation speed
      const pulseSpeed = 3; // Speed of pulse
      const pulseAmount = 0.1; // Amount of scale change
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * pulseAmount;
      meshRef.current.scale.set(pulseScale, pulseScale, pulseScale);
    } else if (hovered) {
      const targetScale = new THREE.Vector3(1.1, 1.1, 1.1);
      meshRef.current.scale.lerp(targetScale, 0.2);
    } else {
      const baseScale = new THREE.Vector3(1, 1, 1);
      meshRef.current.scale.lerp(baseScale, 0.2);
    }
  });

  // Enhanced click handler
  const handleClick = (e: any) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.nativeEvent && e.nativeEvent.stopPropagation) e.nativeEvent.stopPropagation();
    onClick();
  };

  return (
    <mesh
      ref={meshRef}
      position={currentPosition}
      onClick={handleClick}
      onPointerDown={handleClick} // Add pointer down for better mobile support
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={isSelected ? "#ffffff" : color} 
        emissive={isSelected ? color : hovered ? color : "black"}
        emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0}
        metalness={0.3}
        roughness={0.4}
        transparent
        opacity={inGroup ? 0.9 : 1}
      />
    </mesh>
  );
};

export default InteractiveCircle;
