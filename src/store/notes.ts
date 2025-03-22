import { create } from 'zustand';
import { generateId } from '../lib/utils';
import { persist } from 'zustand/middleware';

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple';

export interface Note {
  id: string;
  content: string;
  color: NoteColor;
  category: string;
  pinned: boolean;
  createdAt: Date;
  thumbnail?: string;
}

interface NotesStore {
  notes: Note[];
  searchQuery: string;
  addNote: (content: string, color: NoteColor, category: string, thumbnail?: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  setSearchQuery: (query: string) => void;
  reorderNotes: (notes: Note[]) => void;
}

export const useNotesStore = create<NotesStore>()(persist((set) => ({
  notes: [],
  searchQuery: '',
  addNote: (content, color, category, thumbnail) =>
    set((state) => ({
      notes: [
        {
          id: generateId(),
          content,
          color,
          category,
          pinned: false,
          createdAt: new Date(),
          thumbnail,
        },
        ...state.notes,
      ],
    })),
  updateNote: (id, content) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, content } : note
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    })),
  togglePin: (id) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      ),
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  reorderNotes: (notes) => set({ notes }),
}), {
  name: 'notes-storage',
  storage: {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      const data = JSON.parse(str);
      // Convert string dates back to Date objects
      if (data.state && data.state.notes) {
        data.state.notes = data.state.notes.map((note: Note) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
      }
      return data;
    },
    setItem: (name, value) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    }
  }
}));