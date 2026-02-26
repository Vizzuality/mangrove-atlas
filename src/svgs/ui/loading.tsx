import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgLoading = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 45 45" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g fill="none" fillRule="evenodd" strokeWidth={3} transform="translate(1 1)"><circle cx={18} cy={18} r={18} strokeOpacity={0.5} /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" begin="0s" dur="1s" from="0 18 18" repeatCount="indefinite" to="360 18 18" type="rotate" /></path></g></svg>;
export default SvgLoading;