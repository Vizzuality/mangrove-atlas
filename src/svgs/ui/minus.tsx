import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMinus = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-labelledby={titleId} {...props}>
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M17 1H1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgMinus;
