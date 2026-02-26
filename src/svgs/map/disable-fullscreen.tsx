import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDisableFullscreen = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g fill="#fff" fillRule="evenodd" clipRule="evenodd"><path d="M10 0a1 1 0 0 0 0 2h2.586L9.293 5.293a1 1 0 0 0 1.414 1.414L14 3.414V6a1 1 0 1 0 2 0V1a1 1 0 0 0-.289-.703l-.006-.006A1 1 0 0 0 15 0zM1.001 16H6a1 1 0 1 0 0-2H3.414l3.293-3.293a1 1 0 0 0-1.414-1.414L2 12.586V10a1 1 0 1 0-2 0v5a.997.997 0 0 0 .99 1z" /></g></svg>;
export default SvgDisableFullscreen;