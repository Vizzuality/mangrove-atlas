import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgInfoLegend = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.42} strokeWidth={1.5} d="m9.25 9.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0m-9-3.75h.008v.008H10z" /></svg>;
export default SvgInfoLegend;