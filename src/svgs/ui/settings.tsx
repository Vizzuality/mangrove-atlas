import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgSettings = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.333 4.667h-6M9.333 11.334h-6M11.333 13.334a2 2 0 1 0 0-4 2 2 0 0 0 0 4M4.667 6.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4" /></svg>;
export default SvgSettings;