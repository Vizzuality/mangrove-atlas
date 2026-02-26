import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgEdit = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <g clip-path="url(#clip0_7534_452)">
      <path
        d="M14.1166 4.54138C14.4691 4.189 14.6671 3.71103 14.6672 3.21262C14.6673 2.71421 14.4693 2.23619 14.1169 1.88372C13.7646 1.53124 13.2866 1.33319 12.7882 1.33313C12.2898 1.33307 11.8117 1.531 11.4593 1.88338L2.56194 10.7827C2.40715 10.9371 2.29268 11.1271 2.22861 11.3361L1.34794 14.2374C1.33071 14.295 1.32941 14.3563 1.34417 14.4146C1.35894 14.473 1.38922 14.5262 1.4318 14.5687C1.47439 14.6112 1.52769 14.6414 1.58605 14.6561C1.6444 14.6708 1.70565 14.6694 1.76327 14.6521L4.66527 13.7721C4.87405 13.7086 5.06406 13.5948 5.21861 13.4407L14.1166 4.54138Z"
        stroke="#00857F"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 3.33337L12.6667 6.00004"
        stroke="#00857F"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_7534_452">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgEdit;
