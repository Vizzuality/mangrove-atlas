import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
// Lucide `save-plus` (ISC).
const SvgSavePlus = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    aria-labelledby={titleId}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M12.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V12" />
    <path d="M16 13H8a1 1 0 0 0-1 1v7" />
    <path d="M19 22v-6" />
    <path d="M22 19h-6" />
    <path d="M7 3v4a1 1 0 0 0 1 1h7" />
  </svg>
);
export default SvgSavePlus;
