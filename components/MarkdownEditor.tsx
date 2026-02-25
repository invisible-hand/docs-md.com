'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

type ViewMode = 'write' | 'preview' | 'split';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface FormatAction {
  label: string;
  icon: React.ReactNode;
  shortcut: string;
  action: (textarea: HTMLTextAreaElement, value: string) => { newValue: string; selectionStart: number; selectionEnd: number };
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  value: string,
  before: string,
  after: string,
  placeholder: string
): { newValue: string; selectionStart: number; selectionEnd: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.substring(start, end) || placeholder;
  const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
  return {
    newValue,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selected.length,
  };
}

function insertAtLine(
  textarea: HTMLTextAreaElement,
  value: string,
  prefix: string,
  placeholder: string
): { newValue: string; selectionStart: number; selectionEnd: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.substring(start, end);

  if (selected.includes('\n')) {
    const lines = selected.split('\n');
    const prefixed = lines.map((line, i) =>
      prefix === '1. ' ? `${i + 1}. ${line}` : `${prefix}${line}`
    ).join('\n');
    const newValue = value.substring(0, start) + prefixed + value.substring(end);
    return { newValue, selectionStart: start, selectionEnd: start + prefixed.length };
  }

  const text = selected || placeholder;
  const newValue = value.substring(0, start) + prefix + text + value.substring(end);
  return {
    newValue,
    selectionStart: start + prefix.length,
    selectionEnd: start + prefix.length + text.length,
  };
}

const FORMAT_ACTIONS: FormatAction[] = [
  {
    label: 'Bold',
    icon: <span className="font-bold text-xs">B</span>,
    shortcut: 'Ctrl+B',
    action: (ta, v) => wrapSelection(ta, v, '**', '**', 'bold text'),
  },
  {
    label: 'Italic',
    icon: <span className="italic text-xs">I</span>,
    shortcut: 'Ctrl+I',
    action: (ta, v) => wrapSelection(ta, v, '_', '_', 'italic text'),
  },
  {
    label: 'Strikethrough',
    icon: <span className="line-through text-xs">S</span>,
    shortcut: 'Ctrl+Shift+X',
    action: (ta, v) => wrapSelection(ta, v, '~~', '~~', 'strikethrough'),
  },
  {
    label: 'Code',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    shortcut: 'Ctrl+E',
    action: (ta, v) => wrapSelection(ta, v, '`', '`', 'code'),
  },
  {
    label: 'Link',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    shortcut: 'Ctrl+K',
    action: (ta, v) => {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = v.substring(start, end) || 'link text';
      const newValue = v.substring(0, start) + `[${selected}](url)` + v.substring(end);
      return {
        newValue,
        selectionStart: start + selected.length + 3,
        selectionEnd: start + selected.length + 6,
      };
    },
  },
  {
    label: 'Heading',
    icon: <span className="font-bold text-xs">H</span>,
    shortcut: 'Ctrl+H',
    action: (ta, v) => insertAtLine(ta, v, '## ', 'heading'),
  },
  {
    label: 'Bullet List',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    shortcut: 'Ctrl+Shift+8',
    action: (ta, v) => insertAtLine(ta, v, '- ', 'list item'),
  },
  {
    label: 'Numbered List',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
    shortcut: 'Ctrl+Shift+7',
    action: (ta, v) => insertAtLine(ta, v, '1. ', 'list item'),
  },
  {
    label: 'Blockquote',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5 3.871 3.871 0 01-2.748-1.179z" />
      </svg>
    ),
    shortcut: 'Ctrl+Shift+.',
    action: (ta, v) => insertAtLine(ta, v, '> ', 'quote'),
  },
  {
    label: 'Code Block',
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path strokeLinecap="round" d="M8 10l-2 2 2 2M16 10l2 2-2 2" />
      </svg>
    ),
    shortcut: 'Ctrl+Shift+K',
    action: (ta, v) => wrapSelection(ta, v, '```\n', '\n```', 'code block'),
  },
];

function getStats(text: string) {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { chars, words, lines, readingTime };
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stats = getStats(value);

  const applyFormat = useCallback((action: FormatAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const result = action.action(textarea, value);
    onChange(result.newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }, [value, onChange]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;

      if (e.key === 'b') { e.preventDefault(); applyFormat(FORMAT_ACTIONS[0]); }
      else if (e.key === 'i') { e.preventDefault(); applyFormat(FORMAT_ACTIONS[1]); }
      else if (e.key === 'e') { e.preventDefault(); applyFormat(FORMAT_ACTIONS[3]); }
      else if (e.key === 'k') { e.preventDefault(); applyFormat(FORMAT_ACTIONS[4]); }
      else if (e.key === 'h') { e.preventDefault(); applyFormat(FORMAT_ACTIONS[5]); }
      else if (e.key === 'K' && e.shiftKey) { e.preventDefault(); applyFormat(FORMAT_ACTIONS[9]); }

      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        });
      }
    };

    textarea.addEventListener('keydown', handleKeyDown);
    return () => textarea.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange, applyFormat]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const mdFile = files.find(f => f.name.endsWith('.md') || f.name.endsWith('.txt') || f.name.endsWith('.markdown'));
    if (mdFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onChange(text);
        }
      };
      reader.readAsText(mdFile);
    }
  }, [onChange]);

  return (
    <div className="editor-container bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Tab Bar + Toolbar */}
      <div className="editor-toolbar border-b border-gray-200 bg-gray-50/80">
        <div className="flex items-center justify-between px-4 py-2">
          {/* View Mode Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(['write', 'split', 'preview'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                  viewMode === mode
                    ? 'bg-white text-gray-950 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {mode === 'write' && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Write
                  </span>
                )}
                {mode === 'split' && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                    </svg>
                    Split
                  </span>
                )}
                {mode === 'preview' && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
            <span>{stats.words} words</span>
            <span className="text-gray-300">|</span>
            <span>{stats.lines} lines</span>
            <span className="text-gray-300">|</span>
            <span>{stats.readingTime} min read</span>
          </div>
        </div>

        {/* Format toolbar */}
        {viewMode !== 'preview' && (
          <div className="flex items-center gap-0.5 px-4 pb-2 flex-wrap">
            {FORMAT_ACTIONS.map((action, i) => (
              <div key={action.label} className="flex items-center">
                {(i === 4 || i === 5 || i === 9) && (
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                )}
                <button
                  type="button"
                  onClick={() => applyFormat(action)}
                  title={`${action.label} (${action.shortcut})`}
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Panes */}
      <div
        className={`editor-panes flex-1 flex min-h-0 ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 bg-gray-950/5 backdrop-blur-[1px] flex items-center justify-center rounded-b-2xl border-2 border-dashed border-gray-400 m-0.5">
            <div className="text-center">
              <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Drop .md or .txt file</p>
            </div>
          </div>
        )}

        {/* Write Pane */}
        {viewMode !== 'preview' && (
          <div className={`editor-write-pane ${viewMode === 'split' ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="# Start writing markdown...&#10;&#10;Use the toolbar above or keyboard shortcuts:&#10;  Ctrl+B for **bold**&#10;  Ctrl+I for _italic_&#10;  Ctrl+K for [links](url)&#10;  Ctrl+E for `inline code`&#10;&#10;Or drop a .md file here"
              className="w-full h-full px-6 py-5 font-mono text-sm bg-transparent text-gray-950 resize-none focus:outline-none placeholder:text-gray-300 leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Pane */}
        {viewMode !== 'write' && (
          <div className={`editor-preview-pane overflow-y-auto ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="px-6 py-5">
              {value.trim() ? (
                <MarkdownRenderer content={value} />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <p className="text-gray-300 text-sm italic">Preview will appear here...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile stats */}
      <div className="sm:hidden border-t border-gray-100 px-4 py-2 flex items-center justify-center gap-3 text-xs text-gray-400">
        <span>{stats.words} words</span>
        <span className="text-gray-300">|</span>
        <span>{stats.lines} lines</span>
        <span className="text-gray-300">|</span>
        <span>{stats.readingTime} min read</span>
      </div>
    </div>
  );
}
