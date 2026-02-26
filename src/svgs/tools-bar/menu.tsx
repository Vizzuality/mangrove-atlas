import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMenu = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}

    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM21 18H3V20H21V18Z"
      fill="white"
    />
  </svg>
);
export default SvgMenu;
