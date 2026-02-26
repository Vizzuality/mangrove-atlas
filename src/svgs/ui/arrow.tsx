import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrow = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="#00857F" viewBox="0 0 13 9" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path d="M11.605.793 6.414 6.08 1.224.793 0 2.039l5.802 5.91a.854.854 0 0 0 1.224 0l5.802-5.91z" /></svg>;
export default SvgArrow;