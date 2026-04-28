import React, { useState, useCallback, useMemo } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { format, subDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, ChevronDown, Bold, Italic, Strikethrough, 
  List, ListOrdered, CheckSquare, Quote, Code, 
  Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Heading3,
  Calendar as CalendarIcon, History, ChevronLeft, ChevronRight,
  Clock, Save
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { useJournalStore } from '../../store/journalStore';
import './DailyJournal.css';

// Initialize lowlight
const lowlight = createLowlight(common);

const JournalEditor = ({ selectedDate }) => {
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const { getEntry, updateEntry } = useJournalStore();
  const entry = getEntry(dateString);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer inline',
        },
      }),
      Placeholder.configure({
        placeholder: "Write your thoughts for today...",
        showOnlyWhenEditable: true,
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: entry.content,
    onUpdate: ({ editor }) => {
      updateEntry(dateString, editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'antigravity-editor focus:outline-none min-h-[500px] p-8',
      },
    },
  }, [dateString]);

  // Sync editor content when date changes
  React.useEffect(() => {
    if (editor && entry.content) {
      editor.commands.setContent(entry.content);
    }
  }, [dateString, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({ onClick, isActive, icon: Icon, label }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
      title={label}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-border flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {format(selectedDate, 'MMMM do, yyyy')}
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Clock size={14} />
            {entry.lastEdited ? `Last edited at ${format(entry.lastEdited, 'HH:mm')}` : 'New journal entry'}
          </p>
        </div>
        <button 
          onClick={() => setIsToolbarOpen(!isToolbarOpen)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          {isToolbarOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Toolbar */}
      <AnimatePresence>
        {isToolbarOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-muted/20"
          >
            <div className="p-4 flex flex-wrap gap-2">
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} label="H1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} label="H2" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} label="H3" />
              <div className="w-px h-6 bg-border mx-1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} label="Bold" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} label="Italic" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} label="Strike" />
              <div className="w-px h-6 bg-border mx-1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} label="Bullet List" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} label="Ordered List" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={CheckSquare} label="Task List" />
              <div className="w-px h-6 bg-border mx-1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} label="Quote" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} label="Code Block" />
              <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={LinkIcon} label="Link" />
              <ToolbarButton onClick={() => {}} isActive={false} icon={ImageIcon} label="Image (Coming Soon)" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const MiniCalendar = ({ selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(startOfMonth(subDays(currentMonth, -32)));
  const prevMonth = () => setCurrentMonth(startOfMonth(subDays(currentMonth, 32)));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-muted rounded"><ChevronLeft size={16} /></button>
          <button onClick={nextMonth} className="p-1 hover:bg-muted rounded"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] font-bold text-muted-foreground uppercase">{d}</div>
        ))}
        {days.map(day => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameDay(startOfMonth(day), currentMonth);
          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDate(day)}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-lg transition-all
                ${isSelected ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-muted text-foreground'}
                ${!isCurrentMonth ? 'opacity-20' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const JournalHistory = ({ onSelectDate }) => {
  const { getHistory } = useJournalStore();
  const history = getHistory();
  const [filter, setFilter] = useState(30);

  const filteredHistory = useMemo(() => {
    const cutoff = subDays(new Date(), filter);
    return history.filter(h => new Date(h.date) >= cutoff);
  }, [history, filter]);

  const getRelativeDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (isSameDay(date, today)) return 'Today';
    if (isSameDay(date, subDays(today, 1))) return 'Yesterday';
    return format(date, 'EEEE');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History size={18} className="text-primary" />
          <h3 className="font-bold text-foreground">Journal History</h3>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(parseInt(e.target.value))}
          className="bg-muted text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-1 outline-none border border-border/50"
        >
          <option value={5}>Last 5 days</option>
          <option value={10}>Last 10 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 opacity-30">
            <CalendarIcon size={32} className="mx-auto mb-2" />
            <p className="text-xs uppercase font-bold tracking-widest">No entries found</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <button
              key={item.date}
              onClick={() => onSelectDate(new Date(item.date))}
              className="w-full text-left p-4 rounded-xl border border-border mb-3 hover:bg-muted/50 transition-colors group"
            >
              <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                {getRelativeDate(item.date)}
              </div>
              <div className="text-[10px] font-medium text-muted-foreground mb-2">
                {format(new Date(item.date), 'MMMM do, yyyy')}
              </div>
              <p className="text-[11px] text-muted-foreground/60 line-clamp-1 italic">
                {item.content?.content?.[0]?.content?.[0]?.text || 'Empty entry...'}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default function DailyJournal() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <PageWrapper showBackButton={false}>
      <div className="w-full min-h-screen bg-background text-foreground p-4 md:p-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column: Canvas */}
          <div className="lg:col-span-8 flex flex-col h-full">
            <JournalEditor selectedDate={selectedDate} />
          </div>

          {/* Right Column: Time Machine */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <MiniCalendar 
              selectedDate={selectedDate} 
              onSelectDate={setSelectedDate} 
            />
            <JournalHistory 
              onSelectDate={setSelectedDate} 
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
