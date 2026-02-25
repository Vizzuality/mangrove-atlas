import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgBasemapSettings = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.85} strokeWidth={2}><path d="M8 2 1.5 6 8 10l6.5-4zM1.5 11 8 15l6.5-4" /></g></svg>;
export default SvgBasemapSettings;