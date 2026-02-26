import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgSavedAreas = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="22"
    viewBox="0 0 18 22"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M17 21L9 16.5556L1 21V3.22222C1 2.63285 1.24082 2.06762 1.66947 1.65087C2.09812 1.23413 2.67951 1 3.28571 1H14.7143C15.3205 1 15.9019 1.23413 16.3305 1.65087C16.7592 2.06762 17 2.63285 17 3.22222V21Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export default SvgSavedAreas;
