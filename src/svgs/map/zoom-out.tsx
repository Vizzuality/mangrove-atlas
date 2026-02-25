import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgZoomOut = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.85} strokeWidth={2} d="M3 8h10" /></svg>;
export default SvgZoomOut;