import React, { useState } from 'react';
import { PosterTitle } from '../../types/posterBuilderTypes';
import { THEME } from '../../constants/posterBuilderConstants';

interface CanvasTitleProps {
  title: PosterTitle;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (title: PosterTitle) => void;
  canvasWidth: number;
}

const CanvasTitle: React.FC<CanvasTitleProps> = ({
  title,
  isSelected,
  onSelect,
  onUpdate,
  canvasWidth,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleClick = () => {
    onSelect();
    
    if (isSelected && !isEditing) {
      setIsEditing(true);
    }
  };
  
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...title,
      text: e.target.value,
    });
  };
  
  const handleBlur = () => {
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };
  
  return (
    <div
      className={`relative cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        width: canvasWidth,
        padding: `${title.padding}px`,
        textAlign: title.textAlign,
        backgroundColor: title.backgroundColor,
        borderRadius: isSelected ? THEME.borderRadius.sm : 0,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={title.text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full bg-transparent outline-none text-center"
          style={{
            fontSize: `${title.fontSize}px`,
            fontFamily: title.fontFamily,
            fontWeight: title.fontWeight,
            color: title.color,
            border: 'none',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: `${title.fontSize}px`,
            fontFamily: title.fontFamily,
            fontWeight: title.fontWeight,
            color: title.color,
          }}
        >
          {title.text}
        </div>
      )}
    </div>
  );
};

export default CanvasTitle;