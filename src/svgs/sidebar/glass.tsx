import type { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgGlass = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.1679 6.88303C22.0059 6.88303 25.1172 9.99432 25.1172 13.8323C25.1172 17.6703 22.0059 20.7816 18.1679 20.7816C16.2949 20.7816 14.595 20.0406 13.3453 18.8358L13.1645 18.6549C11.9597 17.4052 11.2187 15.7053 11.2187 13.8323C11.2187 9.99432 14.33 6.88303 18.1679 6.88303ZM11.2922 19.3766C10.0684 17.8608 9.33564 15.9321 9.33564 13.8323C9.33564 8.95436 13.29 5 18.1679 5C23.0459 5 27.0002 8.95436 27.0002 13.8323C27.0002 18.7102 23.0459 22.6646 18.1679 22.6646C16.0681 22.6646 14.1394 21.9318 12.6237 20.7081L6.33175 27L5.00024 25.6685L11.2922 19.3766Z"
      fill="white"
    />
  </svg>
);
export default SvgGlass;
