import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgDrag = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 8 13" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g fill="#000" fillOpacity={0.42}><circle cx={1.5} cy={1.5} r={1.5} /><circle cx={1.5} cy={6.5} r={1.5} /><circle cx={1.5} cy={11.5} r={1.5} /><circle cx={6.5} cy={1.5} r={1.5} /><circle cx={6.5} cy={6.5} r={1.5} /><circle cx={6.5} cy={11.5} r={1.5} /></g></svg>;
export default SvgDrag;