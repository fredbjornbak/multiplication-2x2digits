import React from 'react';
import { Card } from '@/components/ui/card';

interface BoxMethodVisualProps {
  rows: number;
  columns: number;
  className?: string;
}

const BoxMethodVisual: React.FC<BoxMethodVisualProps> = ({ rows, columns, className }) => {
  // Calculate the size of each box to maintain a consistent grid size
  const gridSize = 360; // Reduced from 400 to account for padding
  const padding = {
    top: 5,
    right: 20,
    bottom: 20,
    left: 20
  };
  const boxSize = Math.min(
    (gridSize - padding.left - padding.right) / Math.max(columns, 1),
    (gridSize - padding.top - padding.bottom) / Math.max(rows, 1)
  );

  return (
    <Card className={`p-4 ${className}`}>
      <div 
        className="grid gap-1 bg-white rounded-lg"
        style={{ 
          width: gridSize,
          height: gridSize,
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          gridTemplateColumns: `repeat(${Math.max(columns, 1)}, ${boxSize}px)`,
          gridTemplateRows: `repeat(${Math.max(rows, 1)}, ${boxSize}px)`,
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto' // Center the grid in the card
        }}
      >
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div
            key={index}
            className="bg-blue-100 border border-blue-200 rounded-sm transition-all duration-200"
            style={{
              width: boxSize,
              height: boxSize,
              opacity: rows > 0 && columns > 0 ? 1 : 0
            }}
          />
        ))}
      </div>
    </Card>
  );
};

export default BoxMethodVisual; 