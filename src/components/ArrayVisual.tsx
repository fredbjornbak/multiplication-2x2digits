import React from 'react';

interface ArrayVisualProps {
  rows: number;
  columns: number;
  className?: string;
}

const ArrayVisual: React.FC<ArrayVisualProps> = ({ rows, columns, className }) => {
  const maxSize = 160; // Smaller size for help dialog
  const boxSize = Math.min(maxSize / Math.max(rows, columns), 20);
  
  return (
    <div className={`flex justify-center ${className}`}>
      <div 
        className="grid gap-1 p-2"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, ${boxSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${boxSize}px)`,
        }}
      >
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div
            key={index}
            className="bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-sm"
            style={{
              width: boxSize,
              height: boxSize,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ArrayVisual;