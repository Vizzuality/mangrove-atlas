import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDragger = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 16"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect width={16} height={16} fill="#000" fillOpacity={0.85} rx={8} />
    <path fill="#fff" d="M11 11 8 8.75 5 11V5l3 2.25L11 5z" />
  </svg>
);
export default SvgDragger;
