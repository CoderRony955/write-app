import React, { useState } from 'react';
import { Pin, Trash2, GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { cn } from '../lib/utils';
import { type Note as NoteType } from '../store/notes';
import { useThemeStore } from '../store/theme';

interface NoteProps {
  note: NoteType;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}

const colorClasses = {
  yellow: {
    light: 'bg-yellow-100 hover:bg-yellow-200',
    dark: 'bg-yellow-900/30 hover:bg-yellow-900/40',
  },
  blue: {
    light: 'bg-blue-100 hover:bg-blue-200',
    dark: 'bg-blue-900/30 hover:bg-blue-900/40',
  },
  green: {
    light: 'bg-green-100 hover:bg-green-200',
    dark: 'bg-green-900/30 hover:bg-green-900/40',
  },
  pink: {
    light: 'bg-pink-100 hover:bg-pink-200',
    dark: 'bg-pink-900/30 hover:bg-pink-900/40',
  },
  purple: {
    light: 'bg-purple-100 hover:bg-purple-200',
    dark: 'bg-purple-900/30 hover:bg-purple-900/40',
  },
};

export function Note({ note, onUpdate, onDelete, onPin }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { isDark } = useThemeStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg shadow-lg transition-all overflow-hidden',
        isDark ? colorClasses[note.color].dark : colorClasses[note.color].light,
        isDragging && 'opacity-50',
        note.pinned && 'ring-2 ring-blue-500'
      )}
      {...attributes}
    >
      {note.thumbnail && (
        <div className="w-full h-48">
          <img
            src={note.thumbnail}
            alt="Note thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="absolute right-2 top-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onPin(note.id)}
            className="rounded p-1 hover:bg-black/10"
          >
            <Pin className={cn('h-4 w-4', note.pinned && 'fill-current')} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="rounded p-1 hover:bg-black/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div {...listeners} className="cursor-grab rounded p-1 hover:bg-black/10">
            <GripVertical className="h-4 w-4" />
          </div>
        </div>

        <div className="mb-2 text-xs text-gray-500">
          {note.category && (
            <span className={cn(
              'rounded-full px-2 py-1',
              isDark ? 'bg-black/20' : 'bg-black/5'
            )}>
              {note.category}
            </span>
          )}
        </div>

        {isEditing ? (
          <textarea
            autoFocus
            className={cn(
              'w-full resize-none bg-transparent focus:outline-none',
              isDark ? 'text-white' : 'text-gray-900'
            )}
            value={note.content}
            onChange={(e) => onUpdate(note.id, e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={cn(
              'cursor-text whitespace-pre-wrap',
              isDark ? 'text-white' : 'text-gray-900'
            )}
          >
            {note.content}
          </div>
        )}

        <div className={cn(
          'mt-4 text-xs',
          isDark ? 'text-gray-400' : 'text-gray-500'
        )}>
          {note.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}