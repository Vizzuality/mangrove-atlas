import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDashboard = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 11 11"
    fill="none"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0.5C0 0.223858 0.223858 0 0.5 0H10.5C10.7761 0 11 0.223858 11 0.5V1.5H10V1H1V1.5H0V0.5ZM0 2.5C0 2.22386 0.223858 2 0.5 2H10.5C10.7761 2 11 2.22386 11 2.5V3.5H10V3H1V3.5H0V2.5ZM0.5 4C0.223858 4 0 4.22386 0 4.5V10.5C0 10.7761 0.223858 11 0.5 11H10.5C10.7761 11 11 10.7761 11 10.5V4.5C11 4.22386 10.7761 4 10.5 4H0.5ZM1 10V5H10V10H1Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgDashboard;
