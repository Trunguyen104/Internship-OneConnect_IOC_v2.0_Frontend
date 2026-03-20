'use client';

import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Table2,
  Underline as UnderlineIcon,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { UI_TEXT } from '@/lib/UI_Text';

const EDITOR_STYLE = `
.ProseMirror {
  flex: 1;
  min-height: 100%;
  outline: none;
}

.ProseMirror.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9aa4b2;
  pointer-events: none;
  height: 0;
}

.ProseMirror ul {
  list-style: disc;
  padding-left: 1.25rem;
}

.ProseMirror ol {
  list-style: decimal;
  padding-left: 1.25rem;
}

.ProseMirror li {
  margin: 0.25rem 0;
}
`;

function ToolbarButton({ title, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        border: 'none',
        background: active ? '#e9eef6' : 'transparent',
        borderRadius: 10,
        display: 'grid',
        placeItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 120ms ease',
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) e.currentTarget.style.background = '#f3f6fb';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 28,
        background: '#d7dde7',
        margin: '0 8px',
        flexShrink: 0,
      }}
    />
  );
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = UI_TEXT.TIPTAP.PLACEHOLDER,
}) {
  const lastHtmlRef = useRef('');
  const applyingExternalValueRef = useRef(false);
  const fileInputRef = useRef(null);

  const normalizeHtml = (html) => {
    if (!html) return '';
    const h = html.trim();
    if (h === '<p></p>' || h === '<p><br></p>') return '';
    return h;
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        history: true,
        table: false,
        tableRow: false,
        tableCell: false,
        tableHeader: false,
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),

      Underline,
      HorizontalRule,

      TextAlign.configure({
        types: ['heading', 'paragraph', 'listItem'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
      }),

      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,

      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (applyingExternalValueRef.current) return;

      const html = normalizeHtml(editor.getHTML());
      lastHtmlRef.current = html;
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        style: 'min-height:180px; padding:16px; outline:none; font-size:14px; line-height:1.5;',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const next = normalizeHtml(value ?? '');
    const current = normalizeHtml(editor.getHTML());

    if (next === lastHtmlRef.current) return;

    if (current !== next) {
      applyingExternalValueRef.current = true;

      editor
        .chain()
        .setContent(next, {
          emitUpdate: false,
          parseOptions: { preserveWhitespace: 'full' },
        })
        .focus()
        .run();

      applyingExternalValueRef.current = false;
      lastHtmlRef.current = next;
    }
  }, [editor, value]);

  // Force re-render để toolbar active/highlight cập nhật
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    if (!editor) return;

    const rerender = () => forceUpdate((x) => x + 1);

    editor.on('selectionUpdate', rerender);
    editor.on('transaction', rerender);

    return () => {
      editor.off('selectionUpdate', rerender);
      editor.off('transaction', rerender);
    };
  }, [editor]);

  if (!editor) return null;

  const isAlign = (alignment) => editor.isActive({ textAlign: alignment });

  const setLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt(UI_TEXT.TIPTAP.PROMPT_URL, prev);
    if (url === null) return;

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(UI_TEXT.TIPTAP.IMAGE_ONLY);
      e.target.value = '';
      return;
    }

    const MAX_MB = 3;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(UI_TEXT.TIPTAP.IMAGE_TOO_LARGE);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result;
      editor.chain().focus().setImage({ src }).run();
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const clearFormatting = () => {
    editor.chain().focus().unsetAllMarks().clearNodes().run();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          border: '1px solid #d7dde7',
          borderRadius: 16,
          background: '#fff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* Toolbar */}
        <div style={{ padding: 12 }}>
          {/* Row 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ToolbarButton
              title="Bold"
              active={editor.isActive('bold')}
              disabled={!editor.can().toggleBold()}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Italic"
              active={editor.isActive('italic')}
              disabled={!editor.can().toggleItalic()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Underline"
              active={editor.isActive('underline')}
              disabled={!editor.can().toggleUnderline()}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Strikethrough"
              active={editor.isActive('strike')}
              disabled={!editor.can().toggleStrike()}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough size={20} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              title="H1"
              active={editor.isActive('heading', { level: 1 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="H2"
              active={editor.isActive('heading', { level: 2 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="H3"
              active={editor.isActive('heading', { level: 3 })}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 size={20} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              title="Bullet list"
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Numbered list"
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={20} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              title="Align left"
              active={isAlign('left')}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <AlignLeft size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Align center"
              active={isAlign('center')}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <AlignCenter size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Align right"
              active={isAlign('right')}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <AlignRight size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Justify"
              active={isAlign('justify')}
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
              <AlignJustify size={20} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              title="Quote"
              active={editor.isActive('blockquote')}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote size={20} />
            </ToolbarButton>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
            <ToolbarButton
              title="Code block"
              active={editor.isActive('codeBlock')}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            >
              <Code2 size={20} />
            </ToolbarButton>

            <ToolbarButton
              title="Horizontal rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus size={20} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}>
              <Link2 size={20} />
            </ToolbarButton>

            <ToolbarButton title="Image" onClick={insertImage}>
              <ImageIcon size={20} />
            </ToolbarButton>

            <ToolbarButton title="Table" active={editor.isActive('table')} onClick={insertTable}>
              <Table2 size={20} />
            </ToolbarButton>

            <ToolbarButton title="Clear formatting" onClick={clearFormatting}>
              <Eraser size={20} />
            </ToolbarButton>

            {/* Đã bỏ Undo/Redo */}
          </div>
        </div>

        {/* Editor */}
        <div
          style={{
            borderTop: '1px solid #d7dde7',
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <style jsx global>
            {EDITOR_STYLE}
          </style>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onPickImage}
          />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <EditorContent
              editor={editor}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
