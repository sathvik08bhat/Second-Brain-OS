import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, FileText, Trash2, Bold, Italic,
  List, Heading1, Heading2,
  Save, Pencil, GripHorizontal, X, CheckSquare, Link as LinkIcon, Code as CodeIcon
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import PageWrapper from '../../components/layout/PageWrapper';
import { useNoteStore } from '../../store/noteStore';
import { useNotesSync } from '../../hooks/useNotesSync';
import './NotesPage.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const lowlight = createLowlight(common);
const ResponsiveGridLayout = WidthProvider(Responsive);

// ─── Sortable Sidebar Item ───────────────────────────────────────────────────
function SortableNoteItem({ note, isActive, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: note.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} {...attributes}>
      <div
        className={`note-item group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
          isDragging ? 'z-50 shadow-2xl bg-muted scale-[1.02] border-primary/20' : 
          isActive ? 'bg-primary/5 border-primary/20' : 'border-transparent hover:bg-muted/50'
        }`}
        onClick={() => onClick(note.id)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground/30 hover:text-muted-foreground/60">
            <GripHorizontal size={12} />
          </div>
          <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-muted-foreground/20'}`} />
          <span className={`text-xs font-bold truncate ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
            {note.title || 'Untitled'}
          </span>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Editor ──────────────────────────────────────────────────────────────────
function NoteEditor({ noteId, onClose }) {
  const { notes, updateNoteContent, updateTitle, isSaving, lastSaved } = useNoteStore();
  const note = (notes || []).find((n) => n.id === noteId);
  const [title, setTitle] = useState(note?.title || 'Untitled');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
      Link.configure({ openOnClick: true, HTMLAttributes: { class: 'text-primary underline cursor-pointer inline' } }),
      Placeholder.configure({ placeholder: "Type here, or '/' for blocks...", emptyEditorClass: 'is-editor-empty' }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: note?.content || { type: 'doc', content: [{ type: 'paragraph' }] },
    onUpdate: ({ editor }) => updateNoteContent(noteId, editor.getJSON()),
    editorProps: { attributes: { class: 'antigravity-editor focus:outline-none' } },
  }, [noteId]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL', editor.getAttributes('link').href || '');
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="note-editor-wrapper h-full flex flex-col bg-card group">
      {/* Drag Handle + Title Bar */}
      <div className="drag-handle w-full h-10 cursor-grab active:cursor-grabbing flex items-center justify-between px-4 bg-muted/20 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <FileText size={14} className="text-primary shrink-0" />
          <input
            className="bg-transparent border-none outline-none text-[11px] font-bold text-muted-foreground truncate w-full"
            value={title}
            onChange={(e) => { setTitle(e.target.value); updateTitle(noteId, e.target.value); }}
            placeholder="Untitled"
          />
        </div>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded text-muted-foreground/30">
          <X size={14} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
          <div className="flex items-center gap-1 bg-background/95 backdrop-blur border border-border shadow-2xl rounded-xl p-1.5">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><Bold size={14} /></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><Italic size={14} /></button>
            <button onClick={setLink} className={`p-1.5 rounded-lg ${editor.isActive('link') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><LinkIcon size={14} /></button>
            <div className="w-px h-4 bg-border mx-1" />
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-1.5 rounded-lg ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><Heading1 size={14} /></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-1.5 rounded-lg ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><Heading2 size={14} /></button>
          </div>
        </BubbleMenu>

        <FloatingMenu editor={editor} tippyOptions={{ duration: 150 }}>
          <div className="flex flex-col bg-background/95 backdrop-blur border border-border shadow-2xl rounded-xl p-1.5 min-w-[160px]">
            {[
              { label: 'Heading 1', icon: <Heading1 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
              { label: 'Heading 2', icon: <Heading2 size={14} />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
              { label: 'Bullet List', icon: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run() },
              { label: 'Numbered List', icon: <List size={14} />, action: () => editor.chain().focus().toggleOrderedList().run() },
              { label: 'Checkbox', icon: <CheckSquare size={14} />, action: () => editor.chain().focus().toggleTaskList().run() },
              { label: 'Code Block', icon: <CodeIcon size={14} />, action: () => editor.chain().focus().toggleCodeBlock().run() },
            ].map(item => (
              <button key={item.label} onClick={item.action} className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-xs font-bold text-muted-foreground hover:text-foreground transition-all text-left">
                <span className="text-primary">{item.icon}</span> {item.label}
              </button>
            ))}
          </div>
        </FloatingMenu>

        <EditorContent editor={editor} />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-border/30 flex justify-between items-center bg-muted/5 shrink-0">
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
          {isSaving ? <span className="text-yellow-500/70 flex items-center gap-1"><Save size={10} className="animate-pulse" />Syncing</span>
            : lastSaved ? <span className="text-green-500/50">Saved</span>
            : 'Ready'}
        </span>
      </div>
    </div>
  );
}

// ─── Helper: build a layout entry for a new note ────────────────────────────
function makeLayoutItem(id, existingLayouts, index) {
  const existing = existingLayouts.find(l => l.i === id);
  if (existing) return existing;
  return { i: id, x: (index % 2) * 6, y: Math.floor(index / 2) * 10, w: 6, h: 10, minW: 3, minH: 4 };
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function NotesPage() {
  const { notes, openNoteIds, createNote, toggleOpenNote, deleteNote, setNotes } = useNoteStore();
  const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(true);

  // Layout is computed on-demand, NOT inside a useEffect → no loop possible
  const layoutsRef = useRef({ lg: [] });

  const safeNotes = notes || [];
  const safeOpenIds = openNoteIds || [];

  // Compute layout inline (pure, no side effects)
  const prevLayout = layoutsRef.current.lg || [];
  const currentLayout = safeOpenIds.map((id, i) => makeLayoutItem(id, prevLayout, i));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useNotesSync();

  const onLayoutChange = useCallback((_current, all) => {
    layoutsRef.current = all;
  }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const from = safeNotes.findIndex(n => n.id === active.id);
    const to = safeNotes.findIndex(n => n.id === over.id);
    setNotes(arrayMove(safeNotes, from, to));
  };

  return (
    <PageWrapper showBackButton={false}>
      <div className="notes-layout bg-background overflow-hidden flex h-full relative">

        {/* ── Sidebar ── */}
        <AnimatePresence mode="wait">
          {isNotesSidebarOpen && (
            <motion.div
              className="notes-sidebar bg-card border-r border-border z-20 flex flex-col shrink-0"
              style={{ width: 320 }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Explorer</h3>
                <button className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center" onClick={() => createNote()}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar space-y-1">
                {safeNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                    <FileText size={36} className="text-muted-foreground/10" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workspace Empty</p>
                    <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest w-full max-w-[180px]" onClick={() => createNote()}>
                      New Entry
                    </button>
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={safeNotes.map(n => n.id)} strategy={verticalListSortingStrategy}>
                      {safeNotes.map(note => (
                        <SortableNoteItem key={note.id} note={note} isActive={safeOpenIds.includes(note.id)} onClick={toggleOpenNote} onDelete={deleteNote} />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              <button className="p-4 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground border-t border-border" onClick={() => setIsNotesSidebarOpen(false)}>
                Collapse Sidebar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating Pencil Re-opener ── */}
        {!isNotesSidebarOpen && createPortal(
          <motion.div
            drag
            dragMomentum={false}
            initial={{ x: 80, y: 80 }}
            dragConstraints={{
              top: 0,
              left: 0,
              right: typeof window !== "undefined" ? window.innerWidth - 60 : 1000,
              bottom: typeof window !== "undefined" ? window.innerHeight - 60 : 1000
            }}
            className="fixed z-[9999] cursor-grab active:cursor-grabbing"
          >
            <div
              className="bg-card border border-border p-4 rounded-2xl shadow-2xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group"
              onDoubleClick={() => setIsNotesSidebarOpen(true)}
              title="Double-click to reopen sidebar"
            >
              <Pencil size={22} />
            </div>
          </motion.div>,
          document.body
        )}

        {/* ── Canvas ── */}
        <div className="notes-main flex-1 relative overflow-hidden bg-background/50">
          {safeOpenIds.length > 0 ? (
            <div className="h-full w-full overflow-auto custom-scrollbar p-6">
              <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: currentLayout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={40}
                margin={[20, 20]}
                draggableHandle=".drag-handle"
                onLayoutChange={onLayoutChange}
              >
                {safeOpenIds.map(id => (
                  <div key={id} className="rounded-2xl border border-border overflow-hidden shadow-2xl bg-card">
                    <NoteEditor noteId={id} onClose={() => toggleOpenNote(id)} />
                  </div>
                ))}
              </ResponsiveGridLayout>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-muted/20 rounded-[2.5rem] flex items-center justify-center border border-border/50">
                  <FileText size={40} strokeWidth={1} className="text-muted-foreground/30" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight mb-2">Workspace Canvas</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Select a note from the sidebar to open it</p>
                </div>
                <button
                  className="bg-primary text-primary-foreground px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20 w-full max-w-[300px]"
                  onClick={() => createNote()}
                >
                  Create New Entry
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
