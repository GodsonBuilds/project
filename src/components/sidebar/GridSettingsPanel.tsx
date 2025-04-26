import React from 'react';
import { Grid } from '../../types/posterBuilderTypes';
import SidebarFormGroup from './SidebarFormGroup';
import SidebarSection from './SidebarSection';
import { Grid as GridIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { THEME } from '../../constants/posterBuilderConstants';

interface GridSettingsPanelProps {
  grid: Grid;
  isGridVisible: boolean;
  onUpdateGridDimensions: (rows: number, columns: number) => void;
  onAddRow: () => void;
  onRemoveRow: () => void;
  onAddColumn: () => void;
  onRemoveColumn: () => void;
  onToggleGridVisibility: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const GridSettingsPanel: React.FC<GridSettingsPanelProps> = ({
  grid,
  isGridVisible,
  onUpdateGridDimensions,
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
  onToggleGridVisibility,
  isOpen,
  onToggle,
}) => {
  // Handle direct input of grid dimensions
  const handleGridChange = (dimension: 'rows' | 'columns', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > 10) return;
    
    const newRows = dimension === 'rows' ? numValue : grid.rows;
    const newColumns = dimension === 'columns' ? numValue : grid.columns;
    
    onUpdateGridDimensions(newRows, newColumns);
  };
  
  return (
    <SidebarSection title="Grid Settings" isOpen={isOpen} onToggle={onToggle}>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            Current Grid: {grid.rows} × {grid.columns}
          </div>
          
          <button
            onClick={onToggleGridVisibility}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md ${
              isGridVisible
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-500'
            } hover:bg-gray-300 transition-colors`}
          >
            <GridIcon size={14} />
            {isGridVisible ? 'Hide Grid' : 'Show Grid'}
          </button>
        </div>
        
        {/* Row controls */}
        <div className="mb-4">
          <SidebarFormGroup label="Rows">
            <div className="flex items-center">
              <button
                onClick={onRemoveRow}
                disabled={grid.rows <= 1}
                className={`p-2 rounded-l-md ${
                  grid.rows <= 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <MinusCircle size={16} />
              </button>
              
              <input
                type="number"
                min="1"
                max="10"
                value={grid.rows}
                onChange={(e) => handleGridChange('rows', e.target.value)}
                className="w-full text-center py-2 border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              <button
                onClick={onAddRow}
                disabled={grid.rows >= 10}
                className={`p-2 rounded-r-md ${
                  grid.rows >= 10
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <PlusCircle size={16} />
              </button>
            </div>
          </SidebarFormGroup>
        </div>
        
        {/* Column controls */}
        <SidebarFormGroup label="Columns">
          <div className="flex items-center">
            <button
              onClick={onRemoveColumn}
              disabled={grid.columns <= 1}
              className={`p-2 rounded-l-md ${
                grid.columns <= 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MinusCircle size={16} />
            </button>
            
            <input
              type="number"
              min="1"
              max="10"
              value={grid.columns}
              onChange={(e) => handleGridChange('columns', e.target.value)}
              className="w-full text-center py-2 border-y border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            
            <button
              onClick={onAddColumn}
              disabled={grid.columns >= 10}
              className={`p-2 rounded-r-md ${
                grid.columns >= 10
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <PlusCircle size={16} />
            </button>
          </div>
        </SidebarFormGroup>
        
        {/* Grid preset buttons */}
        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Preset Grids
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { rows: 1, cols: 1, label: '1×1' },
              { rows: 2, cols: 2, label: '2×2' },
              { rows: 3, cols: 3, label: '3×3' },
              { rows: 2, cols: 1, label: '2×1' },
              { rows: 1, cols: 2, label: '1×2' },
              { rows: 3, cols: 2, label: '3×2' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => onUpdateGridDimensions(preset.rows, preset.cols)}
                className={`py-2 text-sm border rounded ${
                  grid.rows === preset.rows && grid.columns === preset.cols
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SidebarSection>
  );
};

export default GridSettingsPanel;