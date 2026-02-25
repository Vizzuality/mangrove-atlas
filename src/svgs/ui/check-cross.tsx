import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCheckCross = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<rect width={20} height={20} x={0.5} y={0.5} fill="#939393" rx={10} /><path fill="#fff" fillRule="evenodd" d="m9.166 10.5-3.333 3.333 1.334 1.333 3.333-3.333 3.333 3.333 1.333-1.333-3.333-3.333 3.333-3.334-1.333-1.333L10.5 9.167 7.166 5.833 5.833 7.167z" clipRule="evenodd" /></svg>;
export default SvgCheckCross;