import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgReset = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      d="M28 16C28 12.8174 26.7357 9.76516 24.4853 7.51472C22.2348 5.26428 19.1826 4 16 4C12.6453 4.01262 9.42529 5.32163 7.01333 7.65333L4 10.6667"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 4V10.6667H10.6667"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 16C4 19.1826 5.26428 22.2348 7.51472 24.4853C9.76516 26.7357 12.8174 28 16 28C19.3547 27.9874 22.5747 26.6784 24.9867 24.3467L28 21.3333"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M21.333 21.3334H27.9997V28"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16.0003 17.3333C16.7367 17.3333 17.3337 16.7363 17.3337 16C17.3337 15.2636 16.7367 14.6666 16.0003 14.6666C15.2639 14.6666 14.667 15.2636 14.667 16C14.667 16.7363 15.2639 17.3333 16.0003 17.3333Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export default SvgReset;
