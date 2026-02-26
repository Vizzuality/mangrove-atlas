import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgSettings = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    width="1em"
    height="1em"
    aria-labelledby={title ? titleId : undefined}
    aria-hidden={!title}
    role={title ? 'img' : 'presentation'}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}

    {/* top line */}
    <path d="M13.333 4.6665H7.33301" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />

    {/* bottom line */}
    <path
      d="M9.33301 11.3335H3.33301"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />

    {/* right circle */}
    <circle cx="11.333" cy="11.3335" r="2" fill="none" stroke="currentColor" strokeWidth={2} />

    {/* left circle */}
    <circle cx="4.66699" cy="4.6665" r="2" fill="none" stroke="currentColor" strokeWidth={2} />
  </svg>
);

export default SvgSettings;
