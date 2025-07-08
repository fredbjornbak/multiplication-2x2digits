import * as THREE from 'three';

export const randomPosition = (radius: number = 5): [number, number, number] => {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.random() * radius;
  return [Math.cos(angle) * r, Math.sin(angle) * r, 0];
};

export const CIRCLE_COLORS = [
  '#82B1FF', // Blue
  '#76FF8A', // Green
  '#FFB74D', // Orange
  '#B388FF', // Purple
  '#F06292', // Pink
]; 