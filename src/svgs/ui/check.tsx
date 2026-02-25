import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgCheck = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<rect width={20} height={20} x={0.5} y={0.5} fill="#00857F" rx={10} /><path fill="#fff" d="m5.91 9.843 2.59 2.58 6.59-6.59 1.41 1.42-8 8-4-4z" /></svg>;
export default SvgCheck;