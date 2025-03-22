import { create } from 'zustand';

export type Tool = 'brush' | 'eraser' | 'shape' | 'text';
export type Shape = 'line' | 'rectangle' | 'circle' | 'triangle' | 'arrow';

interface PaintStore {
  tool: Tool;
  shape: Shape;
  color: string;
  brushSize: number;
  setTool: (tool: Tool) => void;
  setShape: (shape: Shape) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
}

export const usePaintStore = create<PaintStore>((set) => ({
  tool: 'brush',
  shape: 'line',
  color: '#000000',
  brushSize: 5,
  setTool: (tool) => set({ tool }),
  setShape: (shape) => set({ shape }),
  setColor: (color) => set({ color }),
  setBrushSize: (brushSize) => set({ brushSize }),
}));