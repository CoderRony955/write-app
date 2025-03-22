import React, { useRef, useState, useEffect } from 'react';
import { useThemeStore } from '../store/theme';
import { usePaintStore } from '../store/paint';
import { cn } from '../lib/utils';
import { 
  Paintbrush, 
  Eraser, 
  Square, 
  Circle, 
  Triangle,
  ArrowRight,
  Type,
  Download,
  Minus,
  ChevronDown,
  ChevronUp,
  Trash2
} from 'lucide-react';

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const { isDark } = useThemeStore();
  const { tool, shape, color, brushSize, setTool, setShape, setColor, setBrushSize } = usePaintStore();

  const COLORS = [
    '#000000', '#FFFFFF', '#808080', '#FF0000', '#FFA500',
    '#FFFF00', '#008000', '#00FFFF', '#0000FF', '#800080'
  ];

  // Store the canvas state
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL();
    localStorage.setItem('canvasState', imageData);
  };

  // Restore the canvas state
  const restoreCanvasState = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    const savedState = localStorage.getItem('canvasState');
    if (savedState) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = savedState;
    } else {
      // Initial canvas setup
      context.fillStyle = isDark ? '#1f2937' : '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.fillStyle = isDark ? '#1f2937' : '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();
  };

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const containerHeight = (containerWidth * 3) / 4;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.lineCap = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      contextRef.current = context;

      restoreCanvasState();
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [color, brushSize, isDark]);

  // Update context properties when they change
  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = brushSize;
  }, [color, brushSize]);

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const point = getCanvasPoint(e);
    if (!point || !contextRef.current) return;

    if (tool === 'text') {
      setTextPosition(point);
      setShowTextInput(true);
      return;
    }

    contextRef.current.beginPath();
    contextRef.current.moveTo(point.x, point.y);
    setStartPoint(point);
    setIsDrawing(true);
  };

  const drawShape = (endPoint: { x: number; y: number }) => {
    if (!contextRef.current || !startPoint) return;

    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Restore the previous canvas state
    restoreCanvasState();

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    switch (shape) {
      case 'line':
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        break;
      case 'rectangle':
        ctx.strokeRect(
          startPoint.x,
          startPoint.y,
          endPoint.x - startPoint.x,
          endPoint.y - startPoint.y
        );
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)
        );
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        break;
      case 'triangle':
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.lineTo(startPoint.x - (endPoint.x - startPoint.x), endPoint.y);
        ctx.closePath();
        break;
      case 'arrow':
        const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
        const headLength = 20;
        
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        
        ctx.lineTo(
          endPoint.x - headLength * Math.cos(angle - Math.PI / 6),
          endPoint.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endPoint.x, endPoint.y);
        ctx.lineTo(
          endPoint.x - headLength * Math.cos(angle + Math.PI / 6),
          endPoint.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        break;
    }
    
    ctx.stroke();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return;

    const point = getCanvasPoint(e);
    if (!point) return;

    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling while drawing
    }

    if (tool === 'shape') {
      drawShape(point);
    } else {
      if (tool === 'eraser') {
        // Save the current context state
        contextRef.current.save();
        
        // Set eraser properties
        contextRef.current.strokeStyle = isDark ? '#1f2937' : '#ffffff';
        contextRef.current.globalCompositeOperation = 'destination-out';
        
        // Draw eraser stroke
        contextRef.current.lineTo(point.x, point.y);
        contextRef.current.stroke();
        
        // Restore the context state
        contextRef.current.restore();
        
        // Begin a new path to prevent connecting lines
        contextRef.current.beginPath();
        contextRef.current.moveTo(point.x, point.y);
      } else {
        contextRef.current.lineTo(point.x, point.y);
        contextRef.current.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveCanvasState();
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contextRef.current || !textPosition || !textInput.trim()) return;

    const ctx = contextRef.current;
    ctx.font = `${brushSize}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    setTextInput('');
    setShowTextInput(false);
    setTextPosition(null);
    saveCanvasState();
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className={cn(
          'rounded-lg shadow-lg overflow-hidden',
          isDark ? 'bg-gray-800' : 'bg-white'
        )}>
          {/* Mobile Controls Toggle */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="md:hidden w-full p-4 flex items-center justify-between border-b"
          >
            <span className="font-medium">Drawing Tools</span>
            {showControls ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {/* Controls */}
          <div className={cn(
            'p-4 border-b transition-all duration-300 ease-in-out',
            !showControls && 'hidden md:block'
          )}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Tools */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTool('brush')}
                  className={cn(
                    'p-2 rounded-full transition-colors flex-1 md:flex-none',
                    tool === 'brush' ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Paintbrush className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={cn(
                    'p-2 rounded-full transition-colors flex-1 md:flex-none',
                    tool === 'eraser' ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Eraser className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => {
                    setTool('shape');
                    setShape('line');
                  }}
                  className={cn(
                    'p-2 rounded-full transition-colors flex-1 md:flex-none',
                    tool === 'shape' ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Square className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={() => setTool('text')}
                  className={cn(
                    'p-2 rounded-full transition-colors flex-1 md:flex-none',
                    tool === 'text' ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Type className="h-5 w-5 mx-auto" />
                </button>
                <button
                  onClick={clearCanvas}
                  className={cn(
                    'p-2 rounded-full  transition-colors flex-1 md:flex-none text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                  )}
                >
                  <Trash2 className="h-5 w-5 mx-auto" />
                </button>
              </div>

              {/* Shapes */}
              {tool === 'shape' && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShape('line')}
                    className={cn(
                      'p-2 rounded transition-colors flex-1 md:flex-none',
                      shape === 'line' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Minus className="h-5 w-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => setShape('rectangle')}
                    className={cn(
                      'p-2 rounded transition-colors flex-1 md:flex-none',
                      shape === 'rectangle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Square className="h-5 w-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => setShape('circle')}
                    className={cn(
                      'p-2 rounded transition-colors flex-1 md:flex-none',
                      shape === 'circle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Circle className="h-5 w-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => setShape('triangle')}
                    className={cn(
                      'p-2 rounded transition-colors flex-1 md:flex-none',
                      shape === 'triangle' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <Triangle className="h-5 w-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => setShape('arrow')}
                    className={cn(
                      'p-2 rounded transition-colors flex-1 md:flex-none',
                      shape === 'arrow' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    <ArrowRight className="h-5 w-5 mx-auto" />
                  </button>
                </div>
              )}

              {/* Brush Size */}
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full md:w-32"
                />
                <span className={cn(
                  'min-w-[3rem] text-center',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  {brushSize}px
                </span>
              </div>

              {/* Colors */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                      color === c ? 'border-blue-500' : 'border-gray-300'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Save Button */}
              <button
                onClick={saveCanvas}
                className="md:ml-auto px-4 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                <span className="md:hidden">Save</span>
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="p-4 relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={cn(
                'w-full rounded border touch-none bg-white',
                isDark ? 'border-gray-700' : 'border-gray-200'
              )}
              style={{ cursor: tool === 'brush' ? 'crosshair' : 'default' }}
            />

            {/* Text Input Modal */}
            {showTextInput && (
              <form
                onSubmit={handleTextSubmit}
                className={cn(
                  'absolute p-4 rounded-lg shadow-lg',
                  isDark ? 'bg-black' : 'bg-white'
                )}
                style={{
                  left: textPosition?.x ?? 0,
                  top: textPosition?.y ?? 0,
                }}
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className={cn(
                    'w-full rounded border px-3 py-2',
                    isDark 
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  )}
                  placeholder="Enter text..."
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-1 bg-blue-900 text-white rounded-full hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTextInput(false);
                      setTextInput('');
                      setTextPosition(null);
                    }}
                    className={cn(
                      'flex-1 px-3 py-1 rounded',
                      isDark
                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}