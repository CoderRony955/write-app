import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Search } from "lucide-react";
import { Note } from "./components/Note";
import { AddNoteForm } from "./components/AddNoteForm";
import { Navbar } from "./components/Navbar";
import { Paint } from "./components/Paint";
import { useNotesStore } from "./store/notes";
import { useThemeStore } from "./store/theme";
import { cn } from "./lib/utils";

function App() {
  const [currentPage, setCurrentPage] = useState<"notes" | "paint">("notes");
  const {
    notes,
    searchQuery,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setSearchQuery,
    reorderNotes,
  } = useNotesStore();

  const { isDark } = useThemeStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const unpinnedNotes = filteredNotes.filter((note) => !note.pinned);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = notes.findIndex((note) => note.id === active.id);
      const newIndex = notes.findIndex((note) => note.id === over.id);
      reorderNotes(arrayMove(notes, oldIndex, newIndex));
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors",
        isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      )}
    >
      <Navbar onPageChange={setCurrentPage} currentPage={currentPage} />

      {currentPage === "notes" ? (
        <div className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1
                className={cn(
                  "text-3xl font-bold",
                  isDark ? "text-white" : "text-gray-900"
                )}
              >
                My Notes
              </h1>
              <div className="relative w-full sm:w-auto  mt-4">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2",
                    isDark ? "text-gray-400" : "text-gray-500"
                  )}
                />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full sm:w-64 rounded-3xl border pl-10 pr-4 py-2 focus:outline-none focus:ring-2",
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-900"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-900"
                  )}
                />
              </div>
            </div>

            <AddNoteForm onAdd={addNote} />

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-8">
                {pinnedNotes.length > 0 && (
                  <div>
                    <h2
                      className={cn(
                        "mb-4 text-lg font-semibold",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}
                    >
                      📌 Pinned Notes
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <SortableContext
                        items={pinnedNotes}
                        strategy={rectSortingStrategy}
                      >
                        {pinnedNotes.map((note) => (
                          <Note
                            key={note.id}
                            note={note}
                            onUpdate={updateNote}
                            onDelete={deleteNote}
                            onPin={togglePin}
                          />
                        ))}
                      </SortableContext>
                    </div>
                  </div>
                )}

                <div>
                  {pinnedNotes.length > 0 && (
                    <h2
                      className={cn(
                        "mb-4 text-lg font-semibold",
                        isDark ? "text-gray-200" : "text-gray-700"
                      )}
                    >
                      Other Notes
                    </h2>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SortableContext
                      items={unpinnedNotes}
                      strategy={rectSortingStrategy}
                    >
                      {unpinnedNotes.map((note) => (
                        <Note
                          key={note.id}
                          note={note}
                          onUpdate={updateNote}
                          onDelete={deleteNote}
                          onPin={togglePin}
                        />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              </div>
            </DndContext>
          </div>
        </div>
      ) : (
        <Paint />
      )}
    </div>
  );
}

export default App;
