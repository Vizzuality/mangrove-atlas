import ReactMarkdown from 'react-markdown';

function MarkdownViewer({ markdownText }) {
  return (
    <div className="prose prose-sm mx-auto p-4 sm:prose-lg lg:prose-xl">
      <ReactMarkdown>{markdownText}</ReactMarkdown>
    </div>
  );
}

export default MarkdownViewer;
