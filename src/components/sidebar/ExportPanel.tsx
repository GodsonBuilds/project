import React, { useState } from 'react';
import { Download } from 'lucide-react';
import SidebarSection from './SidebarSection';
import SidebarFormGroup from './SidebarFormGroup';
import { ExportOptions } from '../../types/posterBuilderTypes';
import { EXPORT_FORMATS } from '../../constants/posterBuilderConstants';
import { downloadCanvasAsImage } from '../../utils/exportUtils';

interface ExportPanelProps {
  exportOptions: ExportOptions;
  onUpdateExportOptions: (options: Partial<ExportOptions>) => void;
  onExport: () => Promise<void>;
  isOpen: boolean;
  onToggle: () => void;
  canvas: any;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  exportOptions,
  onUpdateExportOptions,
  isOpen,
  onToggle,
  canvas,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  
  const handleExport = async (format: 'png' | 'jpg' | 'webp') => {
    setIsExporting(true);
    setError(null);
    try {
      // Clone canvas object to modify it without affecting the original
      const exportCanvas = JSON.parse(JSON.stringify(canvas));
      
      // If grid should be hidden for export, temporarily clear the cells array
      // This will still keep elements in their positions, but won't show grid lines
      if (!showGrid) {
        // We don't actually remove the cells, we just don't draw their borders in exportUtils.ts
        exportCanvas.hideGridLines = true;
      }
      
      await downloadCanvasAsImage(exportCanvas, { ...exportOptions, format });
    } catch (error) {
      setError('Failed to export poster. Please try again.');
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <SidebarSection title="Export Options" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <SidebarFormGroup label="File Name">
          <input
            type="text"
            value={exportOptions.fileName}
            onChange={(e) => onUpdateExportOptions({ fileName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </SidebarFormGroup>
        
        <SidebarFormGroup label="Format">
          <div className="flex gap-2">
            {EXPORT_FORMATS.map((format) => (
              <button
                key={format.value}
                onClick={() => handleExport(format.value as 'png' | 'jpg' | 'webp')}
                disabled={isExporting}
                className={`flex-1 py-2 text-sm border rounded-md transition-colors flex items-center justify-center gap-2 ${
                  format.value === 'png'
                    ? ' text-gray-700 border-green-300 hover:bg-gray-50'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Download size={16} />
                <span>{format.label}</span>
              </button>
            ))}
          </div>
        </SidebarFormGroup>
        
        <SidebarFormGroup label={`Quality (${exportOptions.quality}%)`}>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={exportOptions.quality}
            onChange={(e) => onUpdateExportOptions({ quality: parseInt(e.target.value, 10) })}
            className="w-full"
          />
        </SidebarFormGroup>

        <div className="flex items-center mb-2">
          <input
            type="checkbox" 
            id="show-grid"
            checked={showGrid}
            onChange={() => setShowGrid(!showGrid)}
            className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="show-grid" className="text-sm text-gray-700">
            Afficher les lignes de grille dans l'export
          </label>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          <p>Your poster will be exported at full resolution.</p>
          <p>The export process may take a few moments for complex posters.</p>
        </div>
      </div>
    </SidebarSection>
  );
};

export default ExportPanel;