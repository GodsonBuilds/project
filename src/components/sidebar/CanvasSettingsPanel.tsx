import React from 'react';
import { Canvas, PosterTitle } from '../../types/posterBuilderTypes';
import SidebarFormGroup from './SidebarFormGroup';
import SidebarSection from './SidebarSection';
import { 
  FONT_FAMILIES, 
  FONT_WEIGHTS, 
  TEXT_ALIGNMENTS 
} from '../../constants/posterBuilderConstants';

interface CanvasSettingsPanelProps {
  canvas: Canvas;
  activeElementId: string | null;
  onUpdateCanvas: (updates: Partial<Canvas>) => void;
  onUpdateTitle: (title: PosterTitle) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CanvasSettingsPanel: React.FC<CanvasSettingsPanelProps> = ({
  canvas,
  activeElementId,
  onUpdateCanvas,
  onUpdateTitle,
  isOpen,
  onToggle,
}) => {
  // Handle canvas size change
  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 100) return;
    
    onUpdateCanvas({
      [dimension]: numValue,
    });
  };
  
  // Handle background color change
  const handleBgColorChange = (color: string) => {
    onUpdateCanvas({
      backgroundColor: color,
    });
  };
  
  // Handle background image upload
  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdateCanvas({
        backgroundImage: event.target?.result as string,
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  // Handle title text change
  const handleTitleChange = (property: keyof PosterTitle, value: any) => {
    onUpdateTitle({
      ...canvas.title,
      [property]: value,
    });
  };
  
  // Determine if title settings should be shown
  const isTitleSelected = activeElementId === 'title';
  
  return (
    <SidebarSection title="Canvas Settings" isOpen={isOpen} onToggle={onToggle}>
      <div>
        {/* Canvas size settings */}
        <div className="flex gap-3 mb-4">
          <SidebarFormGroup label="Width (px)">
            <input
              type="number"
              min="100"
              value={canvas.width}
              onChange={(e) => handleSizeChange('width', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </SidebarFormGroup>
          
          <SidebarFormGroup label="Height (px)">
            <input
              type="number"
              min="100"
              value={canvas.height}
              onChange={(e) => handleSizeChange('height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </SidebarFormGroup>
        </div>
        
        {/* Background settings */}
        <SidebarFormGroup label="Background Color">
          <div className="flex items-center">
            <input
              type="color"
              value={canvas.backgroundColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="mr-2 w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={canvas.backgroundColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </SidebarFormGroup>
        
        <SidebarFormGroup label="Background Image">
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleBgImageUpload}
              className="w-full text-sm"
            />
            
            {canvas.backgroundImage && (
              <div className="mt-2 flex items-center">
                <div className="w-10 h-10 mr-2 bg-gray-200 rounded overflow-hidden">
                  <img
                    src={canvas.backgroundImage}
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onUpdateCanvas({ backgroundImage: null })}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </SidebarFormGroup>
        
        {/* Title settings - only shown when title is selected */}
        {isTitleSelected && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Title Settings</h3>
            
            <SidebarFormGroup label="Title Text">
              <input
                type="text"
                value={canvas.title.text}
                onChange={(e) => handleTitleChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </SidebarFormGroup>
            
            <div className="flex gap-3 mb-3">
              <SidebarFormGroup label="Font Size">
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={canvas.title.fontSize}
                  onChange={(e) => handleTitleChange('fontSize', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </SidebarFormGroup>
              
              <SidebarFormGroup label="Padding">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={canvas.title.padding}
                  onChange={(e) => handleTitleChange('padding', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </SidebarFormGroup>
            </div>
            
            <SidebarFormGroup label="Font Family">
              <select
                value={canvas.title.fontFamily}
                onChange={(e) => handleTitleChange('fontFamily', e.target.value)}
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
                value={canvas.title.fontWeight}
                onChange={(e) => handleTitleChange('fontWeight', e.target.value)}
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
                    value={canvas.title.color}
                    onChange={(e) => handleTitleChange('color', e.target.value)}
                    className="mr-2 w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={canvas.title.color}
                    onChange={(e) => handleTitleChange('color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </SidebarFormGroup>
            </div>
            
            <SidebarFormGroup label="Background Color">
              <div className="flex items-center">
                <input
                  type="color"
                  value={canvas.title.backgroundColor === 'transparent' ? '#ffffff' : canvas.title.backgroundColor}
                  onChange={(e) => handleTitleChange('backgroundColor', e.target.value)}
                  className="mr-2 w-8 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={canvas.title.backgroundColor}
                  onChange={(e) => handleTitleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => handleTitleChange('backgroundColor', 'transparent')}
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
                    onClick={() => handleTitleChange('textAlign', alignment.value)}
                    className={`flex-1 py-2 text-sm border rounded-md ${
                      canvas.title.textAlign === alignment.value
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {alignment.label}
                  </button>
                ))}
              </div>
            </SidebarFormGroup>
          </div>
        )}
      </div>
    </SidebarSection>
  );
};

export default CanvasSettingsPanel;