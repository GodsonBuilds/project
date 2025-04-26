import React from 'react';
import { Canvas, CanvasElement, TextElement as TextElementType } from '../../types/posterBuilderTypes';
import SidebarFormGroup from './SidebarFormGroup';
import SidebarSection from './SidebarSection';
import { 
  FONT_FAMILIES, 
  FONT_WEIGHTS, 
  TEXT_ALIGNMENTS 
} from '../../constants/posterBuilderConstants';

interface ElementSettingsPanelProps {
  canvas: Canvas;
  activeElementId: string | null;
  onUpdateElement: (element: CanvasElement) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ElementSettingsPanel: React.FC<ElementSettingsPanelProps> = ({
  canvas,
  activeElementId,
  onUpdateElement,
  isOpen,
  onToggle,
}) => {
  if (!activeElementId) return null;
  
  // Find the active element in the canvas
  const findActiveElement = (): CanvasElement | null => {
    // Check in canvas elements
    const element = canvas.elements.find(el => el.id === activeElementId);
    if (element) return element;
    
    // Check in grid cells
    for (const cell of canvas.grid.cells) {
      const cellElement = cell.elements.find(el => el.id === activeElementId);
      if (cellElement) return cellElement;
    }
    
    return null;
  };
  
  const activeElement = findActiveElement();
  if (!activeElement) return null;
  
  // Handle updates for text elements
  const handleTextUpdate = (property: keyof TextElementType, value: any) => {
    if (activeElement.type !== 'text') return;
    
    onUpdateElement({
      ...activeElement,
      [property]: value,
    });
  };
  
  // Handle image replacement
  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeElement.type !== 'image') return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdateElement({
        ...activeElement,
        src: event.target?.result as string,
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  // Render controls for text elements
  const renderTextControls = () => {
    if (activeElement.type !== 'text') return null;
    
    return (
      <>
        <SidebarFormGroup label="Text Content">
          <textarea
            value={activeElement.content}
            onChange={(e) => handleTextUpdate('content', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
          />
        </SidebarFormGroup>
        
        <div className="flex gap-3 mb-3">
          <SidebarFormGroup label="Font Size">
            <input
              type="number"
              min="8"
              max="72"
              value={activeElement.fontSize}
              onChange={(e) => handleTextUpdate('fontSize', parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </SidebarFormGroup>
          
          <SidebarFormGroup label="Padding">
            <input
              type="number"
              min="0"
              max="30"
              value={activeElement.padding}
              onChange={(e) => handleTextUpdate('padding', parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </SidebarFormGroup>
        </div>
        
        <SidebarFormGroup label="Font Family">
          <select
            value={activeElement.fontFamily}
            onChange={(e) => handleTextUpdate('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </SidebarFormGroup>
        
        <SidebarFormGroup label="Font Weight">
          <select
            value={activeElement.fontWeight}
            onChange={(e) => handleTextUpdate('fontWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.label}
              </option>
            ))}
          </select>
        </SidebarFormGroup>
        
        <div className="flex gap-3 mb-3">
          <SidebarFormGroup label="Text Color">
            <div className="flex items-center">
              <input
                type="color"
                value={activeElement.color}
                onChange={(e) => handleTextUpdate('color', e.target.value)}
                className="mr-2 w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={activeElement.color}
                onChange={(e) => handleTextUpdate('color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </SidebarFormGroup>
        </div>
        
        <SidebarFormGroup label="Background Color">
          <div className="flex items-center">
            <input
              type="color"
              value={activeElement.backgroundColor === 'transparent' ? '#ffffff' : activeElement.backgroundColor}
              onChange={(e) => handleTextUpdate('backgroundColor', e.target.value)}
              className="mr-2 w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={activeElement.backgroundColor}
              onChange={(e) => handleTextUpdate('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={() => handleTextUpdate('backgroundColor', 'transparent')}
              className="ml-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </SidebarFormGroup>
        
        <SidebarFormGroup label="Text Alignment">
          <div className="flex gap-1">
            {TEXT_ALIGNMENTS.map((alignment) => (
              <button
                key={alignment.value}
                onClick={() => handleTextUpdate('textAlign', alignment.value)}
                className={`flex-1 py-2 text-sm border rounded-md ${
                  activeElement.textAlign === alignment.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {alignment.label}
              </button>
            ))}
          </div>
        </SidebarFormGroup>
      </>
    );
  };
  
  // Render controls for image elements
  const renderImageControls = () => {
    if (activeElement.type !== 'image') return null;
    
    return (
      <>
        <div className="mb-4">
          <img
            src={activeElement.src}
            alt="Element preview"
            className="w-full h-32 object-contain bg-gray-100 rounded-md"
          />
        </div>
        
        <SidebarFormGroup label="Replace Image">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageReplace}
            className="w-full text-sm"
          />
        </SidebarFormGroup>
        
        <SidebarFormGroup label="Alt Text">
          <input
            type="text"
            value={activeElement.alt}
            onChange={(e) => onUpdateElement({
              ...activeElement,
              alt: e.target.value,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </SidebarFormGroup>
      </>
    );
  };
  
  // Render general element controls (size, position, rotation)
  const renderGeneralControls = () => {
    return (
      <>
        <div className="flex gap-3 mb-3">
          <SidebarFormGroup label="Width">
            <div className="flex items-center">
              <input
                type="number"
                min="20"
                value={Math.round(activeElement.width)}
                onChange={(e) => onUpdateElement({
                  ...activeElement,
                  width: parseInt(e.target.value, 10),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="ml-1 text-sm text-gray-500">px</span>
            </div>
          </SidebarFormGroup>
          
          <SidebarFormGroup label="Height">
            <div className="flex items-center">
              <input
                type="number"
                min="20"
                value={Math.round(activeElement.height)}
                onChange={(e) => onUpdateElement({
                  ...activeElement,
                  height: parseInt(e.target.value, 10),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="ml-1 text-sm text-gray-500">px</span>
            </div>
          </SidebarFormGroup>
        </div>
        
        <div className="flex gap-3 mb-3">
          <SidebarFormGroup label="X Position">
            <div className="flex items-center">
              <input
                type="number"
                value={Math.round(activeElement.x)}
                onChange={(e) => onUpdateElement({
                  ...activeElement,
                  x: parseInt(e.target.value, 10),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="ml-1 text-sm text-gray-500">px</span>
            </div>
          </SidebarFormGroup>
          
          <SidebarFormGroup label="Y Position">
            <div className="flex items-center">
              <input
                type="number"
                value={Math.round(activeElement.y)}
                onChange={(e) => onUpdateElement({
                  ...activeElement,
                  y: parseInt(e.target.value, 10),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="ml-1 text-sm text-gray-500">px</span>
            </div>
          </SidebarFormGroup>
        </div>
        
        <SidebarFormGroup label="Rotation">
          <div className="flex items-center">
            <input
              type="range"
              min="0"
              max="360"
              value={activeElement.rotation}
              onChange={(e) => onUpdateElement({
                ...activeElement,
                rotation: parseInt(e.target.value, 10),
              })}
              className="flex-1 mr-2"
            />
            <input
              type="number"
              min="0"
              max="360"
              value={Math.round(activeElement.rotation)}
              onChange={(e) => onUpdateElement({
                ...activeElement,
                rotation: parseInt(e.target.value, 10) % 360,
              })}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <span className="ml-1 text-sm text-gray-500">°</span>
          </div>
        </SidebarFormGroup>
      </>
    );
  };
  
  return (
    <SidebarSection 
      title={`${activeElement.type === 'text' ? 'Text' : 'Image'} Element Settings`} 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div>
        {activeElement.type === 'text' && renderTextControls()}
        {activeElement.type === 'image' && renderImageControls()}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Position & Size</h3>
          {renderGeneralControls()}
        </div>
      </div>
    </SidebarSection>
  );
};

export default ElementSettingsPanel;