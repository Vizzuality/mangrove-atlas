import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgHide = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    aria-labelledby={title ? titleId : undefined}
    aria-hidden={!title}
    role={title ? 'img' : 'presentation'}
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.42}
      strokeWidth={1.5}
    >
      {/* eye outline */}
      <path d="M5.036 15.322a1 1 0 0 1 0-.639C6.423 10.51 10.36 7.5 15 7.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C23.577 19.49 19.64 22.5 15 22.5c-4.638 0-8.574-3.007-9.964-7.178" />

      {/* pupil */}
      <path d="M18 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />

      {/* slash (hide) */}
      <path d="M6 6l18 18" />
    </g>
  </svg>
);
export default SvgHide;
