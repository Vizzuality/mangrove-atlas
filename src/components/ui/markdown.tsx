import React from 'react';
import ReactMarkdown from 'react-markdown';

type MarkdownTextProps = {
  content?: string;
};

const MarkdownText = ({ content }: MarkdownTextProps) => {
  if (!content) return null;

  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="font-light text-black/85">{children}</p>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-800 font-bold underline"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownText;
