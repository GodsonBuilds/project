import React from 'react';
import { X, Download } from 'lucide-react';
import { Canvas, ExportOptions } from '../../types/posterBuilderTypes';
import { renderCanvasToImage } from '../../utils/exportUtils';

interface PosterPreviewProps {
  canvas: Canvas;
  exportOptions: ExportOptions;
  onClose: () => void;
  onExport: () => Promise<void>;
}

const PosterPreview: React.FC<PosterPreviewProps> = ({
  canvas,
  exportOptions,
  onClose,
  onExport,
}) => {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [isExporting, setIsExporting] = React.useState(false);

  // Generate preview image when component mounts
  React.useEffect(() => {
    const generatePreview = async () => {
      try {
        const dataUrl = await renderCanvasToImage(canvas, exportOptions);
        setPreviewUrl(dataUrl);
      } catch (error) {
        console.error('Failed to generate preview:', error);
      }
    };

    generatePreview();
  }, [canvas, exportOptions]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
      // Close the preview after successful export
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-screen flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Poster Preview</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-auto flex-grow p-4 flex items-center justify-center bg-gray-100">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Poster Preview" 
              className="max-w-full max-h-[calc(100vh-200px)] shadow-md"
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="animate-pulse flex items-center justify-center h-64 w-full">
              <span>Generating preview...</span>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Format: <span className="font-medium uppercase">{exportOptions.format}</span> · 
              Quality: <span className="font-medium">{exportOptions.quality}%</span> · 
              Filename: <span className="font-medium">{exportOptions.fileName}.{exportOptions.format}</span>
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || !previewUrl}
            className={`px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-md ${
              isExporting || !previewUrl ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
            } transition-colors`}
          >
            <Download size={18} />
            <span>{isExporting ? 'Exporting...' : 'Download Poster'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosterPreview; 