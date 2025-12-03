
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2, Plus, StickyNote } from 'lucide-react';

const PersonalNotes = () => {
  const { notes, addNote, deleteNote } = useData();
  const [newNote, setNewNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    await addNote(newNote);
    setNewNote('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Personal Notes</h2>
        <p className="text-slate-500">Keep track of your ideas and reminders.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="flex gap-3">
           <input 
             type="text" 
             value={newNote}
             onChange={(e) => setNewNote(e.target.value)}
             placeholder="Write a new note..."
             className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
           />
           <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2">
             <Plus size={18} /> Add
           </button>
        </form>
      </div>

      <div className="grid gap-4">
        {notes.length === 0 && (
           <div className="text-center py-12 text-slate-400">
              <StickyNote size={48} className="mx-auto mb-3 opacity-20" />
              <p>No notes yet. Add one above!</p>
           </div>
        )}
        {notes.map((note) => (
          <div key={note.id} className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 shadow-sm flex justify-between items-start group transition-all hover:shadow-md">
             <p className="text-slate-700 whitespace-pre-wrap">{note.text}</p>
             <button 
               onClick={() => deleteNote(note.id)}
               className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-4"
             >
               <Trash2 size={18} />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalNotes;
