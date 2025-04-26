export interface ElementBase {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  gridCellId: string | null; // If placed in a grid cell
}

export interface TextElement extends ElementBase {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  padding: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageElement extends ElementBase {
  type: 'image';
  src: string;
  alt: string;
}

export type CanvasElement = TextElement | ImageElement;

export interface GridCell {
  id: string;
  rowIndex: number;
  colIndex: number;
  width: number;
  height: number;
  x: number;
  y: number;
  elements: CanvasElement[];
}

export interface Grid {
  rows: number;
  columns: number;
  cells: GridCell[];
}

export interface PosterTitle {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string;
  backgroundColor: string;
  padding: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface Canvas {
  width: number;
  height: number;
  backgroundImage: string | null;
  backgroundColor: string;
  grid: Grid;
  elements: CanvasElement[]; // Elements not in grid cells
  title: PosterTitle;
  scale: number;
}

export interface ExportOptions {
  format: 'jpg' | 'png' | 'webp';
  quality: number;
  fileName: string;
}

export type ActiveElement = {
  id: string;
  type: 'title' | 'element' | 'grid';
} | null;

export type SidebarSection = 'canvas' | 'grid' | 'element' | 'export';