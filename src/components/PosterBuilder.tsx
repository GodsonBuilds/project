import React, { useState, useEffect } from 'react';
import { useCanvasState } from '../hooks/useCanvasState';
import { createTextElement, createImageElement } from '../utils/canvasUtils';
import CanvasEditor from './canvas/CanvasEditor';
import Sidebar from './sidebar/Sidebar';
import { ZoomIn, ZoomOut, Maximize, Minus, Plus, FileSpreadsheet, Leaf } from 'lucide-react';
import { THEME } from '../constants/posterBuilderConstants';

const PosterBuilder: React.FC = () => {
  const {
    canvas,
    activeElement,
    activeSidebarSection,
    exportOptions,
    isGridVisible,
    
    setCanvas,
    setBackgroundColor,
    setBackgroundImage,
    setCanvasSize,
    
    setGridDimensions,
    addGridRow,
    removeGridRow,
    addGridColumn,
    removeGridColumn,
    toggleGridVisibility,
    
    addElement,
    removeElement,
    updateElementProperties,
    moveElementTo,
    selectElement,
    clearSelection,
    
    updateTitle,
    
    updateExportOptions,
    exportCanvas,
    
    setSidebarSection,
  } = useCanvasState();
  
  // Handle zoom controls
  const handleZoomIn = () => {
    setCanvas({
      ...canvas,
      scale: Math.min(2, canvas.scale + 0.1),
    });
  };
  
  const handleZoomOut = () => {
    setCanvas({
      ...canvas,
      scale: Math.max(0.5, canvas.scale - 0.1),
    });
  };
  
  const handleResetZoom = () => {
    setCanvas({
      ...canvas,
      scale: 1,
    });
  };
  
  // Handle element drop (from drag and drop)
  const handleDropElement = (
    elementType: 'text' | 'image',
    imageUrl: string | null,
    x: number,
    y: number,
    cellId: string | null,
    textStyle?: string
  ) => {
    if (elementType === 'text') {
      const textElement = createTextElement(x, y, cellId, textStyle);
      addElement(textElement);
    } else if (elementType === 'image' && imageUrl) {
      // For images, we need to create a temporary image to get dimensions
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const width = 200; // Default width
        const height = width / aspectRatio;
        
        const imageElement = createImageElement(imageUrl, x, y, width, height, cellId);
        addElement(imageElement);
      };
      img.src = imageUrl;
    }
  };
  
  // Handle adding an element directly (without drag and drop)
  const handleAddElement = (elementType: 'text' | 'image', imageUrl?: string, textStyle?: string) => {
    // Calculate center position
    const x = canvas.width / 2 - 100;
    const y = canvas.height / 2 - 50;
    
    handleDropElement(elementType, imageUrl || null, x, y, null, textStyle);
  };
  
  // Update canvas properties
  const handleUpdateCanvas = (updates: Partial<typeof canvas>) => {
    setCanvas({ ...canvas, ...updates });
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-white rounded-lg shadow-2xl">
      <div className="flex-1 overflow-auto" style={{ height: '100vh' }}>
        <div className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-zen-green-500 p-2 rounded-lg mr-3">
                <Leaf size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Poster Canvas</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={16} className="text-gray-600" />
              </button>
              
              <div className="px-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md py-1">
                {Math.round(canvas.scale * 100)}%
              </div>
              
              <button
                onClick={handleZoomIn}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={16} className="text-gray-600" />
              </button>
              
              <button
                onClick={handleResetZoom}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors ml-2"
                title="Reset Zoom"
              >
                <Maximize size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
          
          <div 
            className="mx-auto rounded-lg shadow-xl overflow-hidden bg-white border-4 border-zen-green-400"
            style={{ 
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 150px)',
              width: canvas.width * canvas.scale,
              height: canvas.height * canvas.scale,
            }}
          >
            <CanvasEditor
              canvas={canvas}
              isGridVisible={isGridVisible}
              activeElementId={activeElement?.id || null}
              onSelectElement={selectElement}
              onUpdateElement={updateElementProperties}
              onUpdateTitle={updateTitle}
              onDeleteElement={removeElement}
              onClearSelection={clearSelection}
              onDropElement={handleDropElement}
            />
          </div>
        </div>
      </div>
      
      <Sidebar
        canvas={canvas}
        activeElementId={activeElement?.id || null}
        activeSidebarSection={activeSidebarSection}
        exportOptions={exportOptions}
        isGridVisible={isGridVisible}
        
        onUpdateCanvas={handleUpdateCanvas}
        onUpdateTitle={updateTitle}
        onUpdateGridDimensions={setGridDimensions}
        onAddRow={addGridRow}
        onRemoveRow={removeGridRow}
        onAddColumn={addGridColumn}
        onRemoveColumn={removeGridColumn}
        onToggleGridVisibility={toggleGridVisibility}
        onUpdateElement={updateElementProperties}
        onAddElement={handleAddElement}
        onUpdateExportOptions={updateExportOptions}
        onExport={exportCanvas}
        onChangeSidebarSection={setSidebarSection}
      />
    </div>
  );
};

export default PosterBuilder;