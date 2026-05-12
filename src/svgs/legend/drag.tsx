import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDrag = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="20"
    viewBox="0 0 12 20"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}

    <circle cx="3.5" cy="3.5" r="1.5" fill="black" fillOpacity="0.42" />
    <circle cx="3.5" cy="10" r="1.5" fill="black" fillOpacity="0.42" />
    <circle cx="3.5" cy="16.5" r="1.5" fill="black" fillOpacity="0.42" />
    <circle cx="8.5" cy="3.5" r="1.5" fill="black" fillOpacity="0.42" />
    <circle cx="8.5" cy="10" r="1.5" fill="black" fillOpacity="0.42" />
    <circle cx="8.5" cy="16.5" r="1.5" fill="black" fillOpacity="0.42" />
  </svg>
);
export default SvgDrag;
