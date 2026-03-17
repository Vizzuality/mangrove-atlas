import DOMPurify from 'dompurify';

function SafeHTML({ html, className }: { html: string; className?: string }) {
  const clean = DOMPurify.sanitize(html);

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}

export default SafeHTML;
