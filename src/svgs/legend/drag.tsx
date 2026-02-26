import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDrag = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}

    <circle cx="9.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.42" />
    <circle cx="9.5" cy="12.5" r="1.5" fill="black" fill-opacity="0.42" />
    <circle cx="9.5" cy="17.5" r="1.5" fill="black" fill-opacity="0.42" />
    <circle cx="14.5" cy="7.5" r="1.5" fill="black" fill-opacity="0.42" />
    <circle cx="14.5" cy="12.5" r="1.5" fill="black" fill-opacity="0.42" />
    <circle cx="14.5" cy="17.5" r="1.5" fill="black" fill-opacity="0.42" />
  </svg>
);
export default SvgDrag;
