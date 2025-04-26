import React, { useRef } from 'react';
import { Canvas as CanvasType, CanvasElement, GridCell } from '../../types/posterBuilderTypes';
import TextElement from '../elements/TextElement';
import ImageElement from '../elements/ImageElement';
import CanvasTitle from './CanvasTitle';
import { THEME } from '../../constants/posterBuilderConstants';

interface CanvasEditorProps {
  canvas: CanvasType;
  isGridVisible: boolean;
  activeElementId: string | null;
  onSelectElement: (elementId: string, type: 'element' | 'title' | 'grid') => void;
  onUpdateElement: (element: CanvasElement) => void;
  onUpdateTitle: (title: any) => void;
  onDeleteElement: (elementId: string) => void;
  onClearSelection: () => void;
  onDropElement: (
    elementType: 'text' | 'image',
    imageUrl: string | null,
    x: number,
    y: number,
    cellId: string | null,
    textStyle?: string
  ) => void;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  canvas,
  isGridVisible,
  activeElementId,
  onSelectElement,
  onUpdateElement,
  onUpdateTitle,
  onDeleteElement,
  onClearSelection,
  onDropElement,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Handle background click to clear selection
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };
  
  // Handle canvas drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, cellId: string | null = null) => {
    e.preventDefault();
    
    const elementType = e.dataTransfer.getData('elementType') as 'text' | 'image';
    let imageUrl = null;
    let textStyle = undefined;
    
    if (elementType === 'image') {
      imageUrl = e.dataTransfer.getData('imageUrl');
    } else if (elementType === 'text') {
      textStyle = e.dataTransfer.getData('textStyle') || undefined;
    }
    
    // Calculate drop coordinates relative to canvas
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate the position considering canvas scale
    const x = (e.clientX - canvasRect.left) / canvas.scale;
    const y = (e.clientY - canvasRect.top) / canvas.scale;
    
    onDropElement(elementType, imageUrl, x, y, cellId, textStyle);
  };
  
  // Setup drag over handler
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  // Render grid cells
  const renderGrid = () => {
    return canvas.grid.cells.map((cell) => (
      <div
        key={cell.id}
        className={`absolute ${isGridVisible ? 'border border-dashed border-gray-300' : ''}`}
        style={{
          left: cell.x,
          top: cell.y,
          width: cell.width,
          height: cell.height,
          transform: `scale(${canvas.scale})`,
          transformOrigin: '0 0',
        }}
        onDrop={(e) => handleDrop(e, cell.id)}
        onDragOver={handleDragOver}
      >
        {renderCellElements(cell)}
      </div>
    ));
  };
  
  // Render elements within a cell
  const renderCellElements = (cell: GridCell) => {
    return cell.elements.map((element) => (
      renderElement(element, true)
    ));
  };
  
  // Render an individual element
  const renderElement = (element: CanvasElement, inCell: boolean = false) => {
    const isSelected = activeElementId === element.id;
    
    if (element.type === 'text') {
      return (
        <TextElement
          key={element.id}
          element={element}
          isSelected={isSelected}
          onSelect={() => onSelectElement(element.id, 'element')}
          onUpdate={onUpdateElement}
          onDelete={() => onDeleteElement(element.id)}
          scale={canvas.scale}
        />
      );
    } else if (element.type === 'image') {
      return (
        <ImageElement
          key={element.id}
          element={element}
          isSelected={isSelected}
          onSelect={() => onSelectElement(element.id, 'element')}
          onUpdate={onUpdateElement}
          onDelete={() => onDeleteElement(element.id)}
          scale={canvas.scale}
        />
      );
    }
    
    return null;
  };
  
  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden"
      style={{ 
        backgroundColor: canvas.backgroundColor,
        backgroundImage: canvas.backgroundImage ? `url(${canvas.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleBackgroundClick}
      onDrop={(e) => handleDrop(e)}
      onDragOver={handleDragOver}
    >
      <CanvasTitle
        title={canvas.title}
        isSelected={activeElementId === 'title'}
        onSelect={() => onSelectElement('title', 'title')}
        onUpdate={onUpdateTitle}
        canvasWidth={canvas.width}
      />
      
      {renderGrid()}
      
      {/* Free-floating elements (not in a grid cell) */}
      {canvas.elements.map((element) => (
        renderElement(element)
      ))}
    </div>
  );
};

export default CanvasEditor;