import React, { useState, useRef } from 'react';
import { renderMarkdown } from '../utils/markdown';
import { BoldIcon, ItalicIcon, HeadingIcon, ListIcon } from './icons';

interface MarkdownEditorProps {
    content: string;
    onContentChange: (newContent: string) => void;
}

type EditorView = 'write' | 'preview';

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onContentChange }) => {
    const [view, setView] = useState<EditorView>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const applyStyle = (startSyntax: string, endSyntax: string, placeholder: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        
        const newText = `${content.substring(0, start)}${startSyntax}${selectedText || placeholder}${endSyntax}${content.substring(end)}`;
        onContentChange(newText);
        
        setTimeout(() => {
            textarea.focus();
            if (!selectedText) {
                textarea.setSelectionRange(start + startSyntax.length, start + startSyntax.length + placeholder.length);
            } else {
                 textarea.setSelectionRange(start + startSyntax.length, start + startSyntax.length + selectedText.length);
            }
        }, 0);
    };

    const applyBlockStyle = (syntax: string, placeholder: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        // Find the start of the current line
        let lineStart = start;
        while(lineStart > 0 && content[lineStart - 1] !== '\n') {
            lineStart--;
        }

        const newText = `${content.substring(0, lineStart)}${syntax}${selectedText || placeholder}${content.substring(end)}`;
        onContentChange(newText);
        
        setTimeout(() => {
            textarea.focus();
            if (!selectedText) {
                 textarea.setSelectionRange(lineStart + syntax.length, lineStart + syntax.length + placeholder.length);
            } else {
                textarea.setSelectionRange(lineStart + syntax.length, lineStart + syntax.length + selectedText.length);
            }
        }, 0);
    };

    const editorControls = [
        { label: 'Bold', icon: BoldIcon, action: () => applyStyle('**', '**', 'bold text') },
        { label: 'Italic', icon: ItalicIcon, action: () => applyStyle('*', '*', 'italic text') },
        { label: 'Heading', icon: HeadingIcon, action: () => applyBlockStyle('## ', 'Heading') },
        { label: 'List', icon: ListIcon, action: () => applyBlockStyle('* ', 'List item') },
    ];

    return (
        <div className="border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center border-b border-gray-300 p-2 bg-white rounded-t-lg">
                <div className="flex items-center space-x-1">
                    {editorControls.map(({ label, icon: Icon, action }) => (
                        <button
                            key={label}
                            type="button"
                            onClick={action}
                            title={label}
                            className="p-2 rounded-md hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
                <div className="flex items-center border border-gray-300 rounded-lg p-0.5 bg-gray-100">
                    <button
                        type="button"
                        onClick={() => setView('write')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'write' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setView('preview')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Preview
                    </button>
                </div>
            </div>
            <div className="p-1">
                {view === 'write' ? (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => onContentChange(e.target.value)}
                        className="w-full h-96 p-3 bg-gray-50 border-0 focus:ring-0 resize-none font-mono text-sm leading-6"
                        placeholder="Your article content goes here..."
                    />
                ) : (
                    <div className="prose p-4 bg-white min-h-96 font-serif">
                        {renderMarkdown(content)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkdownEditor;
