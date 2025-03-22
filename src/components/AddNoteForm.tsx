import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, X } from 'lucide-react';
import { type NoteColor } from '../store/notes';
import { useThemeStore } from '../store/theme';
import { cn } from '../lib/utils';

interface AddNoteFormProps {
  onAdd: (content: string, color: NoteColor, category: string, thumbnail?: string) => void;
}

const colors: NoteColor[] = ['yellow', 'blue', 'green', 'pink', 'purple'];

export function AddNoteForm({ onAdd }: AddNoteFormProps) {
  const [content, setContent] = useState('');
  const [color, setColor] = useState<NoteColor>('yellow');
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDark } = useThemeStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content.trim(), color, category.trim(), thumbnail);
      setContent('');
      setCategory('');
      setThumbnail(undefined);
      setIsExpanded(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnail(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'mb-8 rounded-lg p-4 shadow-lg transition-colors',
        isDark ? 'bg-gray-700' : 'bg-white'
      )}
    >
      {isExpanded ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className={cn(
                  'w-full resize-none rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-blue-900 min-h-[400px] text-base leading-relaxed',
                  isDark
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                )}
                rows={8}
                autoFocus
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (optional)"
                className={cn(
                  'w-full mt-4 rounded border p-3 focus:outline-none focus:ring-2 focus:ring-blue-900',
                  isDark
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            {/* Thumbnail Preview/Upload Area */}
            <div className={cn(
              'w-full md:w-48 h-48 rounded-3xl  border-2 border-dashed flex flex-col items-center justify-center relative',
              isDark ? 'border-gray-600' : 'border-gray-300'
            )}>
              {thumbnail ? (
                <div className="relative w-full h-full">
                  <img
                    src={thumbnail}
                    alt="Note thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail(undefined)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg transition-colors w-full h-full',
                    isDark
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm text-center">
                    Click to add thumbnail
                    <br />
                    <span className="text-xs opacity-75">
                      (Max 5MB)
                    </span>
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 ${color === c ? 'border-blue-500' : 'border-transparent'
                    } bg-${c}-200`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setThumbnail(undefined);
                }}
                className={cn(
                  'rounded-full px-6 py-2.5 transition-colors font-medium',
                  isDark
                    ? 'text-gray-300 hover:bg-gray-600'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-blue-900 px-6 py-2.5 text-white hover:bg-blue-700 font-medium"
              >
                Add Note
              </button>
            </div>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className={cn(
            'flex w-full items-center gap-2 rounded-full border p-4 transition-colors',
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          )}
        >
          <Plus className="h-5 w-5" />
          <span>Add a new note...</span>
        </button>
      )}
    </form>
  );
}