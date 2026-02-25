import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMenu = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#fff" fillRule="evenodd" d="M3 4h18v2H3zm0 7h18v2H3zm18 7H3v2h18z" clipRule="evenodd" /></svg>;
export default SvgMenu;