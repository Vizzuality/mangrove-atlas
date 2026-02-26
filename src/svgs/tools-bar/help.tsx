import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgHelp = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    width="1em"
    height="1em"
    aria-labelledby={title ? titleId : undefined}
    aria-hidden={!title}
    role={title ? 'img' : 'presentation'}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}

    {/* question mark */}
    <path
      d="M9.5 9a3.5 3.5 0 1 1 5 2.8c-1.5.8-2.2 1.4-2.2 2.7"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* dot */}
    <circle cx="12" cy="18" r="1.6" fill="currentColor" />
  </svg>
);

export default SvgHelp;
