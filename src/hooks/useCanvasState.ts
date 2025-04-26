import { useState, useCallback } from 'react';
import { 
  Canvas, 
  CanvasElement, 
  TextElement, 
  ImageElement, 
  PosterTitle, 
  ExportOptions,
  ActiveElement,
  SidebarSection
} from '../types/posterBuilderTypes';
import {
  DEFAULT_CANVAS,
  DEFAULT_EXPORT_OPTIONS
} from '../constants/posterBuilderConstants';
import {
  createGrid,
  addElementToCanvas,
  removeElementFromCanvas,
  updateElement,
  findElementById,
  moveElement,
  createTextElement,
  createImageElement,
  addRow,
  removeRow,
  addColumn,
  removeColumn
} from '../utils/canvasUtils';
import { downloadCanvasAsImage } from '../utils/exportUtils';

interface UseCanvasStateReturn {
  canvas: Canvas;
  activeElement: ActiveElement;
  activeSidebarSection: SidebarSection;
  exportOptions: ExportOptions;
  isGridVisible: boolean;
  
  // Canvas actions
  setCanvas: (canvas: Canvas) => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundImage: (imageUrl: string | null) => void;
  setCanvasSize: (width: number, height: number) => void;
  
  // Grid actions
  setGridDimensions: (rows: number, columns: number) => void;
  addGridRow: () => void;
  removeGridRow: () => void;
  addGridColumn: () => void;
  removeGridColumn: () => void;
  toggleGridVisibility: () => void;
  
  // Element actions
  addElement: (element: CanvasElement) => void;
  removeElement: (elementId: string) => void;
  updateElementProperties: (element: CanvasElement) => void;
  moveElementTo: (elementId: string, targetGridCellId: string | null, x: number, y: number) => void;
  selectElement: (elementId: string, type: 'title' | 'element' | 'grid') => void;
  clearSelection: () => void;
  
  // Title actions
  updateTitle: (title: PosterTitle) => void;
  
  // Export actions
  updateExportOptions: (options: Partial<ExportOptions>) => void;
  exportCanvas: () => Promise<void>;
  
  // UI actions
  setSidebarSection: (section: SidebarSection) => void;
}

export const useCanvasState = (): UseCanvasStateReturn => {
  // Initialize with default canvas
  const [canvas, setCanvas] = useState<Canvas>({
    ...DEFAULT_CANVAS,
    grid: createGrid(
      DEFAULT_CANVAS.grid.rows,
      DEFAULT_CANVAS.grid.columns,
      DEFAULT_CANVAS.width,
      DEFAULT_CANVAS.height
    ),
  });
  
  const [activeElement, setActiveElement] = useState<ActiveElement>(null);
  const [activeSidebarSection, setActiveSidebarSection] = useState<SidebarSection>('canvas');
  const [exportOptions, setExportOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);
  const [isGridVisible, setIsGridVisible] = useState<boolean>(true);
  
  // Canvas actions
  const setBackgroundColor = useCallback((color: string) => {
    setCanvas(prev => ({ ...prev, backgroundColor: color }));
  }, []);
  
  const setBackgroundImage = useCallback((imageUrl: string | null) => {
    setCanvas(prev => ({ ...prev, backgroundImage: imageUrl }));
  }, []);
  
  const setCanvasSize = useCallback((width: number, height: number) => {
    setCanvas(prev => {
      const newCanvas = { ...prev, width, height };
      // Recreate grid to fit new canvas size
      const newGrid = createGrid(
        prev.grid.rows,
        prev.grid.columns,
        width,
        height
      );
      return { ...newCanvas, grid: newGrid };
    });
  }, []);
  
  // Grid actions
  const setGridDimensions = useCallback((rows: number, columns: number) => {
    setCanvas(prev => {
      const newGrid = createGrid(rows, columns, prev.width, prev.height);
      return { ...prev, grid: newGrid };
    });
  }, []);
  
  const addGridRow = useCallback(() => {
    setCanvas(prev => addRow(prev));
  }, []);
  
  const removeGridRow = useCallback(() => {
    setCanvas(prev => removeRow(prev));
  }, []);
  
  const addGridColumn = useCallback(() => {
    setCanvas(prev => addColumn(prev));
  }, []);
  
  const removeGridColumn = useCallback(() => {
    setCanvas(prev => removeColumn(prev));
  }, []);
  
  const toggleGridVisibility = useCallback(() => {
    setIsGridVisible(prev => !prev);
  }, []);
  
  // Element actions
  const addElement = useCallback((element: CanvasElement) => {
    setCanvas(prev => addElementToCanvas(prev, element));
  }, []);
  
  const removeElement = useCallback((elementId: string) => {
    setCanvas(prev => removeElementFromCanvas(prev, elementId));
    // Clear selection if the removed element was selected
    if (activeElement?.id === elementId) {
      setActiveElement(null);
    }
  }, [activeElement]);
  
  const updateElementProperties = useCallback((element: CanvasElement) => {
    setCanvas(prev => updateElement(prev, element));
  }, []);
  
  const moveElementTo = useCallback((
    elementId: string, 
    targetGridCellId: string | null, 
    x: number, 
    y: number
  ) => {
    setCanvas(prev => moveElement(prev, elementId, targetGridCellId, x, y));
  }, []);
  
  const selectElement = useCallback((
    elementId: string, 
    type: 'title' | 'element' | 'grid'
  ) => {
    setActiveElement({ id: elementId, type });
    setActiveSidebarSection(type === 'title' || type === 'grid' ? 'canvas' : 'element');
  }, []);
  
  const clearSelection = useCallback(() => {
    setActiveElement(null);
  }, []);
  
  // Title actions
  const updateTitle = useCallback((title: PosterTitle) => {
    setCanvas(prev => ({ ...prev, title }));
  }, []);
  
  // Export actions
  const updateExportOptions = useCallback((options: Partial<ExportOptions>) => {
    setExportOptions(prev => ({ ...prev, ...options }));
  }, []);
  
  const exportCanvas = useCallback(async () => {
    try {
      await downloadCanvasAsImage(canvas, exportOptions);
    } catch (error) {
      console.error('Failed to export canvas:', error);
    }
  }, [canvas, exportOptions]);
  
  return {
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
    
    setSidebarSection: setActiveSidebarSection,
  };
};