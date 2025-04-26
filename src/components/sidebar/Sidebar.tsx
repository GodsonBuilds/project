import React, { useState } from 'react';
import { 
  Settings, 
  Grid, 
  Square, 
  Palette, 
  Download,
  ChevronRight,
  ChevronLeft,
  Leaf
} from 'lucide-react';
import { 
  Canvas, 
  CanvasElement, 
  PosterTitle, 
  ExportOptions, 
  SidebarSection as SidebarSectionType 
} from '../../types/posterBuilderTypes';
import { THEME } from '../../constants/posterBuilderConstants';
import CanvasSettingsPanel from './CanvasSettingsPanel';
import GridSettingsPanel from './GridSettingsPanel';
import ElementSettingsPanel from './ElementSettingsPanel';
import ElementLibraryPanel from './ElementLibraryPanel';
import ExportPanel from './ExportPanel';

interface SidebarProps {
  canvas: Canvas;
  activeElementId: string | null;
  activeSidebarSection: SidebarSectionType;
  exportOptions: ExportOptions;
  isGridVisible: boolean;
  
  onUpdateCanvas: (updates: Partial<Canvas>) => void;
  onUpdateTitle: (title: PosterTitle) => void;
  onUpdateGridDimensions: (rows: number, columns: number) => void;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddColumn: () => void;
  onRemoveColumn: () => void;
  onToggleGridVisibility: () => void;
  onUpdateElement: (element: CanvasElement) => void;
  onAddElement: (elementType: 'text' | 'image', imageUrl?: string, textStyle?: string) => void;
  onUpdateExportOptions: (options: Partial<ExportOptions>) => void;
  onExport: () => Promise<void>;
  onChangeSidebarSection: (section: SidebarSectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  canvas,
  activeElementId,
  activeSidebarSection,
  exportOptions,
  isGridVisible,
  
  onUpdateCanvas,
  onUpdateTitle,
  onUpdateGridDimensions,
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
  onToggleGridVisibility,
  onUpdateElement,
  onAddElement,
  onUpdateExportOptions,
  onExport,
  onChangeSidebarSection,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Toggle sidebar collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  // Helper function to determine if a section is open
  const isSectionOpen = (section: SidebarSectionType) => {
    return activeSidebarSection === section;
  };
  
  // Helper function to toggle a section
  const toggleSection = (section: SidebarSectionType) => {
    if (isSectionOpen(section)) {
      // If already open, just close it and stay on current section
      onChangeSidebarSection('canvas');
    } else {
      // If closed, open it
      onChangeSidebarSection(section);
    }
  };
  
  return (
    <div 
      className={`relative bg-white border-l border-gray-200 transition-all h-screen overflow-hidden flex flex-col ${
        isCollapsed ? 'w-14' : 'w-72'
      }`}
      style={{ boxShadow: THEME.shadows.lg }}
    >
      {isCollapsed ? (
        <div className="p-2 h-full bg-green-50">
          <button
            onClick={toggleCollapse}
            className="flex items-center justify-center w-10 h-10 mb-4 rounded-full bg-zen-green-500 hover:bg-zen-green-400 transition-colors"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
          
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={() => {
                toggleCollapse();
                onChangeSidebarSection('canvas');
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                activeSidebarSection === 'canvas' 
                  ? 'bg-zen-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
              title="Canvas Settings"
            >
              <Palette size={18} />
            </button>
            
            <button
              onClick={() => {
                toggleCollapse();
                onChangeSidebarSection('grid');
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                activeSidebarSection === 'grid' 
                  ? 'bg-zen-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
              title="Grid Settings"
            >
              <Grid size={18} />
            </button>
            
            <button
              onClick={() => {
                toggleCollapse();
                onChangeSidebarSection('element');
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                activeSidebarSection === 'element' 
                  ? 'bg-zen-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
              title="Element Library"
            >
              <Square size={18} />
            </button>
            
            <button
              onClick={() => {
                toggleCollapse();
                onChangeSidebarSection('export');
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                activeSidebarSection === 'export' 
                  ? 'bg-zen-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } transition-colors`}
              title="Export Options"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 shrink-0 bg-zen-green-500 text-white">
            <div className="flex items-center">
              <Leaf size={20} className="mr-2" />
              <h2 className="text-lg font-semibold">ZenGrowth Design</h2>
            </div>
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto grow bg-green-50">
            <div className="space-y-4">
              <CanvasSettingsPanel
                canvas={canvas}
                activeElementId={activeElementId}
                onUpdateCanvas={onUpdateCanvas}
                onUpdateTitle={onUpdateTitle}
                isOpen={isSectionOpen('canvas')}
                onToggle={() => toggleSection('canvas')}
              />
              
              <GridSettingsPanel
                grid={canvas.grid}
                isGridVisible={isGridVisible}
                onUpdateGridDimensions={onUpdateGridDimensions}
                onAddRow={onAddRow}
                onRemoveRow={onRemoveRow}
                onAddColumn={onAddColumn}
                onRemoveColumn={onRemoveColumn}
                onToggleGridVisibility={onToggleGridVisibility}
                isOpen={isSectionOpen('grid')}
                onToggle={() => toggleSection('grid')}
              />
              
              <ElementLibraryPanel
                onAddElement={onAddElement}
                isOpen={isSectionOpen('element')}
                onToggle={() => toggleSection('element')}
              />
              
              {activeElementId && (
                <ElementSettingsPanel
                  canvas={canvas}
                  activeElementId={activeElementId}
                  onUpdateElement={onUpdateElement}
                  isOpen={isSectionOpen('element')}
                  onToggle={() => toggleSection('element')}
                />
              )}
              
              <ExportPanel
                exportOptions={exportOptions}
                canvas={canvas}
                onUpdateExportOptions={onUpdateExportOptions}
                onExport={onExport}
                isOpen={isSectionOpen('export')}
                onToggle={() => toggleSection('export')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;