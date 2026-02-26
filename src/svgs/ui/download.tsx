import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDownload = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 30 30"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <rect width={28} height={28} x={1} y={1} strokeWidth={2} opacity={0.2} rx={14} />
    <path
      fill="#00857F"
      d="M9 20v2h12v-2zM10.707 11.586 9 13l6 6 6-6-1.707-1.414L16 14.879V8h-2v6.879z"
    />
  </svg>
);
export default SvgDownload;
