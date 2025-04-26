import React, { useState, useRef, useEffect } from 'react';
import { TextElement as TextElementType } from '../../types/posterBuilderTypes';
import { THEME } from '../../constants/posterBuilderConstants';

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: TextElementType) => void;
  onDelete: () => void;
  scale: number;
}

const TextElement: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  scale,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  const [startRotation, setStartRotation] = useState(0);
  
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSelected) {
      onSelect();
      return;
    }
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    });
  };
  
  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartCoords({ x: e.clientX, y: e.clientY });
    setStartDimensions({ width: element.width, height: element.height });
  };
  
  // Handle rotate start
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    
    const rect = elementRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate the angle between the center of the element and the mouse position
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    setStartRotation(startAngle - element.rotation);
  };
  
  // Handle mouse move for dragging, resizing, or rotating
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdate({
          ...element,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing) {
        const deltaX = (e.clientX - startCoords.x) / scale;
        const deltaY = (e.clientY - startCoords.y) / scale;
        
        onUpdate({
          ...element,
          width: Math.max(50, startDimensions.width + deltaX),
          height: Math.max(30, startDimensions.height + deltaY),
        });
      } else if (isRotating && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate the current angle between the center of the element and the mouse position
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
        let newRotation = (currentAngle - startRotation) % 360;
        
        // Normalize rotation to 0-360 range
        if (newRotation < 0) newRotation += 360;
        
        onUpdate({
          ...element,
          rotation: newRotation,
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsRotating(false);
    };
    
    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging, 
    isResizing, 
    isRotating, 
    element, 
    dragOffset, 
    onUpdate, 
    startCoords, 
    startDimensions,
    startRotation,
    scale
  ]);
  
  return (
    <div
      ref={elementRef}
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 10 : 1,
        transition: isDragging || isResizing || isRotating ? 'none' : 'all 0.1s ease',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="w-full h-full"
        style={{
          fontSize: `${element.fontSize}px`,
          fontFamily: element.fontFamily,
          fontWeight: element.fontWeight,
          color: element.color,
          backgroundColor: element.backgroundColor,
          padding: `${element.padding}px`,
          textAlign: element.textAlign,
          overflow: 'hidden',
          border: isSelected ? `2px solid ${THEME.colors.primary}` : 'none',
          borderRadius: THEME.borderRadius.sm,
          boxShadow: isSelected ? THEME.shadows.md : 'none',
        }}
      >
        {element.content}
      </div>
      
      {isSelected && (
        <>
          {/* Resize handle */}
          <div
            className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full cursor-se-resize"
            style={{
              right: -8,
              bottom: -8,
              borderColor: THEME.colors.primary,
              zIndex: 20,
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          
          {/* Rotate handle */}
          <div
            className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full cursor-crosshair"
            style={{
              top: -24,
              left: '50%',
              marginLeft: -8,
              borderColor: THEME.colors.primary,
              zIndex: 20,
            }}
            onMouseDown={handleRotateStart}
          />
          
          {/* Delete button */}
          <button
            className="absolute flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            style={{
              top: -8,
              right: -8,
              zIndex: 20,
              fontSize: '14px',
            }}
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

export default TextElement;