import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgZoomIn = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.85} strokeWidth={2}><path d="M8 3v10M3 8h10" /></g></svg>;
export default SvgZoomIn;