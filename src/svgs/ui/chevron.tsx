import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgChevron = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}

    <path d="M0.707031 0.707031L5.70703 5.70703L10.707 0.707031" stroke="#00857F" strokeWidth={2} />
  </svg>
);
export default SvgChevron;
