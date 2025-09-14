import React from 'react';

const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file.
            return React.createElement('strong', { key: index }, part.slice(2, -2));
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file.
            return React.createElement('em', { key: index }, part.slice(1, -1));
        }
        return part;
    });
};

export const renderMarkdown = (markdown: string): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    if (!markdown) return elements;

    const lines = markdown.split('\n');
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
        if (listItems.length > 0) {
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file.
            elements.push(
                React.createElement('ul', { key: `ul-${elements.length}`, className: "list-disc pl-5 my-4 space-y-2" },
                    listItems.map((item, i) => React.createElement('li', { key: i }, parseInlineFormatting(item)))
                )
            );
            listItems = [];
        }
        inList = false;
    };
    
    lines.forEach((line, index) => {
        if (line.startsWith('## ')) {
            flushList();
            // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file.
            elements.push(React.createElement('h2', { key: index, className: "text-3xl font-bold font-serif mt-8 mb-4" }, line.substring(3)));
        } else if (line.startsWith('* ')) {
            inList = true;
            listItems.push(line.substring(2));
        } else if (line.trim() === '') {
            flushList();
        } else {
            flushList();
            if (line.trim().length > 0) {
              // FIX: Replaced JSX with React.createElement to resolve TSX parsing errors in a .ts file.
              elements.push(React.createElement('p', { key: index, className: "my-4 leading-relaxed" }, parseInlineFormatting(line)));
            }
        }
    });

    flushList();
    return elements;
};
