import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgShare = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#000" fillOpacity={0.85} fillRule="evenodd" d="M14.924 4.617a1 1 0 0 0-.218-.325l-2.999-3a1 1 0 1 0-1.414 1.415L11.586 4H10a5 5 0 0 0-5 5v1a1 1 0 1 0 2 0V9a3 3 0 0 1 3-3h1.586l-1.293 1.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 .217-1.09" clipRule="evenodd" /><path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.85} strokeWidth={2} d="M14 11.5v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h.5" /></svg>;
export default SvgShare;