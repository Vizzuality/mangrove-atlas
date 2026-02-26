import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgAlert = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 50 50"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#003C39"
      fillOpacity={0.15}
      d="M25 27.166a1.78 1.78 0 0 1-1.777-1.777v-8a1.778 1.778 0 0 1 3.555 0v8a1.777 1.777 0 0 1-1.777 1.777m0 2.222a2.222 2.222 0 1 0 0 4.444 2.222 2.222 0 0 0 0-4.444m15.105 6.38a6.2 6.2 0 0 0 .14-6.175l-9.912-17.865C29.256 9.71 27.263 8.5 25.001 8.5c-2.254 0-4.243 1.202-5.32 3.214L9.74 29.62a6.2 6.2 0 0 0 .16 6.149 6 6 0 0 0 5.174 2.952h19.854c2.13 0 4.067-1.103 5.176-2.952M27.212 13.425l9.91 17.865c.45.84.423 1.831-.066 2.647-.469.779-1.244 1.226-2.127 1.226H15.075c-.886 0-1.659-.447-2.128-1.226a2.65 2.65 0 0 1-.082-2.62l9.942-17.918c.448-.837 1.27-1.342 2.195-1.342.927 0 1.746.5 2.21 1.368"
    />
  </svg>
);
export default SvgAlert;
