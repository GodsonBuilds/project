import { v4 as uuidv4 } from 'uuid';
import {
  Canvas,
  CanvasElement,
  Grid,
  GridCell,
  TextElement,
  ImageElement,
} from '../types/posterBuilderTypes';
import { DEFAULT_TEXT_ELEMENT } from '../constants/posterBuilderConstants';

// Generate a unique ID for elements
export const generateId = (): string => uuidv4();

// Create a new grid with specified rows and columns
export const createGrid = (rows: number, columns: number, canvasWidth: number, canvasHeight: number): Grid => {
  const titleHeight = 70; // Reserve space for the title
  const availableHeight = canvasHeight - titleHeight;
  
  const cellWidth = canvasWidth / columns;
  const cellHeight = availableHeight / rows;
  
  const cells: GridCell[] = [];
  
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      cells.push({
        id: generateId(),
        rowIndex,
        colIndex,
        width: cellWidth,
        height: cellHeight,
        x: colIndex * cellWidth,
        y: titleHeight + rowIndex * cellHeight,
        elements: [],
      });
    }
  }
  
  return {
    rows,
    columns,
    cells,
  };
};

// Update grid dimensions
export const updateGrid = (canvas: Canvas, newRows: number, newColumns: number): Canvas => {
  const newGrid = createGrid(newRows, newColumns, canvas.width, canvas.height);
  
  // Attempt to preserve elements in their grid cells
  canvas.grid.cells.forEach(cell => {
    // Find the corresponding cell in the new grid if it exists
    const newCell = newGrid.cells.find(
      newCell => newCell.rowIndex < newRows && 
                newCell.colIndex < newColumns && 
                newCell.rowIndex === cell.rowIndex && 
                newCell.colIndex === cell.colIndex
    );
    
    if (newCell) {
      // Copy elements to the new cell
      newCell.elements = [...cell.elements.map(element => ({
        ...element,
        gridCellId: newCell.id,
      }))];
    } else {
      // If the cell doesn't exist in the new grid, move elements to the canvas
      canvas.elements = [
        ...canvas.elements,
        ...cell.elements.map(element => ({
          ...element,
          gridCellId: null,
        })),
      ];
    }
  });
  
  return {
    ...canvas,
    grid: newGrid,
  };
};

// Add a row to the grid
export const addRow = (canvas: Canvas): Canvas => {
  return updateGrid(canvas, canvas.grid.rows + 1, canvas.grid.columns);
};

// Remove a row from the grid
export const removeRow = (canvas: Canvas): Canvas => {
  if (canvas.grid.rows <= 1) return canvas;
  return updateGrid(canvas, canvas.grid.rows - 1, canvas.grid.columns);
};

// Add a column to the grid
export const addColumn = (canvas: Canvas): Canvas => {
  return updateGrid(canvas, canvas.grid.rows, canvas.grid.columns + 1);
};

// Remove a column from the grid
export const removeColumn = (canvas: Canvas): Canvas => {
  if (canvas.grid.columns <= 1) return canvas;
  return updateGrid(canvas, canvas.grid.rows, canvas.grid.columns - 1);
};

// Create a new text element
export const createTextElement = (
  x: number, 
  y: number, 
  gridCellId: string | null = null,
  textStyle?: string
): TextElement => {
  const baseElement = {
    id: generateId(),
    type: 'text' as const,
    x,
    y,
    gridCellId,
    rotation: 0,
    ...DEFAULT_TEXT_ELEMENT,
  };

  // Apply different styles based on the textStyle parameter
  switch (textStyle) {
    case 'heading':
      return {
        ...baseElement,
        content: 'Heading Text',
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center' as const,
        backgroundColor: 'transparent',
        color: '#1A202C',
      };
    case 'paragraph':
      return {
        ...baseElement,
        content: 'This is a paragraph of text. You can edit this to add your content.',
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'left' as const,
        backgroundColor: 'transparent',
        width: 300,
        height: 100,
      };
    case 'quote':
      return {
        ...baseElement,
        content: '"This is a quotation. You can attribute it to the source."',
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'Georgia',
        textAlign: 'center' as const,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        padding: 16,
        width: 350,
        height: 120,
      };
    case 'list':
      return {
        ...baseElement,
        content: '• Item one\n• Item two\n• Item three',
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'left' as const,
        backgroundColor: 'transparent',
        width: 250,
        height: 120,
      };
    default:
      return baseElement;
  }
};

// Create a new image element
export const createImageElement = (
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
  gridCellId: string | null = null
): ImageElement => {
  return {
    id: generateId(),
    type: 'image',
    src,
    alt: 'Uploaded image',
    x,
    y,
    width,
    height,
    rotation: 0,
    gridCellId,
  };
};

// Add an element to the canvas
export const addElementToCanvas = (canvas: Canvas, element: CanvasElement): Canvas => {
  if (element.gridCellId) {
    // Add to a specific grid cell
    const updatedCells = canvas.grid.cells.map(cell => {
      if (cell.id === element.gridCellId) {
        return {
          ...cell,
          elements: [...cell.elements, element],
        };
      }
      return cell;
    });
    
    return {
      ...canvas,
      grid: {
        ...canvas.grid,
        cells: updatedCells,
      },
    };
  } else {
    // Add to canvas (not in a grid cell)
    return {
      ...canvas,
      elements: [...canvas.elements, element],
    };
  }
};

// Remove an element from the canvas
export const removeElementFromCanvas = (canvas: Canvas, elementId: string): Canvas => {
  // Check if element is in a grid cell
  let updatedCanvas = { ...canvas };
  
  // Try to remove from grid cells
  const updatedCells = canvas.grid.cells.map(cell => {
    const elementIndex = cell.elements.findIndex(element => element.id === elementId);
    if (elementIndex !== -1) {
      // Element found in this cell
      const updatedElements = [...cell.elements];
      updatedElements.splice(elementIndex, 1);
      return {
        ...cell,
        elements: updatedElements,
      };
    }
    return cell;
  });
  
  updatedCanvas.grid = {
    ...updatedCanvas.grid,
    cells: updatedCells,
  };
  
  // Or remove from canvas elements if not in a cell
  updatedCanvas.elements = updatedCanvas.elements.filter(element => element.id !== elementId);
  
  return updatedCanvas;
};

// Update an element's properties
export const updateElement = (canvas: Canvas, updatedElement: CanvasElement): Canvas => {
  // First, check if the element is in the canvas (not in a grid cell)
  const elementIndex = canvas.elements.findIndex(element => element.id === updatedElement.id);
  
  if (elementIndex !== -1) {
    // Element is in the canvas
    const updatedElements = [...canvas.elements];
    updatedElements[elementIndex] = updatedElement;
    
    return {
      ...canvas,
      elements: updatedElements,
    };
  }
  
  // Check if element is in a grid cell
  const updatedCells = canvas.grid.cells.map(cell => {
    const cellElementIndex = cell.elements.findIndex(element => element.id === updatedElement.id);
    
    if (cellElementIndex !== -1) {
      // Element found in this cell
      const updatedElements = [...cell.elements];
      updatedElements[cellElementIndex] = updatedElement;
      
      return {
        ...cell,
        elements: updatedElements,
      };
    }
    
    return cell;
  });
  
  return {
    ...canvas,
    grid: {
      ...canvas.grid,
      cells: updatedCells,
    },
  };
};

// Find element by ID (either in canvas or any grid cell)
export const findElementById = (canvas: Canvas, elementId: string): CanvasElement | null => {
  // Check in canvas elements
  const canvasElement = canvas.elements.find(element => element.id === elementId);
  if (canvasElement) return canvasElement;
  
  // Check in grid cells
  for (const cell of canvas.grid.cells) {
    const cellElement = cell.elements.find(element => element.id === elementId);
    if (cellElement) return cellElement;
  }
  
  return null;
};

// Move element between grid cells or to/from canvas
export const moveElement = (
  canvas: Canvas, 
  elementId: string, 
  targetGridCellId: string | null,
  newX: number,
  newY: number
): Canvas => {
  const element = findElementById(canvas, elementId);
  if (!element) return canvas;
  
  // Remove from current location
  const canvasWithoutElement = removeElementFromCanvas(canvas, elementId);
  
  // Update element position and grid cell ID
  const updatedElement = {
    ...element,
    x: newX,
    y: newY,
    gridCellId: targetGridCellId,
  };
  
  // Add to new location
  return addElementToCanvas(canvasWithoutElement, updatedElement);
};