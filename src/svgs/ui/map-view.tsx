import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMapView = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
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
      d="M10.794 0.0756995C10.9226 0.160511 11 0.304269 11 0.458335V9.16667C11 9.35001 10.8907 9.51572 10.7222 9.58794L7.51388 10.9629C7.40532 11.0095 7.28299 11.0123 7.1724 10.9708L3.67806 9.66044L0.63888 10.9629C0.497271 11.0236 0.334645 11.0091 0.206025 10.9243C0.0774047 10.8395 0 10.6957 0 10.5417V1.83333C0 1.64999 0.109265 1.48428 0.277787 1.41206L3.48612 0.0370601C3.59468 -0.00946534 3.71701 -0.0122868 3.8276 0.0291841L7.32194 1.33956L10.3611 0.0370601C10.5027 -0.0236293 10.6654 -0.00911227 10.794 0.0756995ZM0.916667 2.13556L3.20833 1.15342V8.86444L0.916667 9.84659V2.13556ZM6.875 9.88029L4.125 8.84904V1.11971L6.875 2.15096V9.88029ZM7.79167 9.84659L10.0833 8.86444V1.15342L7.79167 2.13556V9.84659Z"
      fill="currentColor"
    />
  </svg>
);
export default SvgMapView;
