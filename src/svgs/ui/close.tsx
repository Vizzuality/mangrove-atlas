import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgClose = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 21" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fillRule="evenodd" d="m15.304 14.39-1.415 1.413-9.192-9.192 1.414-1.414z" /><path fillRule="evenodd" d="M6.11 15.803 4.697 14.39l9.193-9.192 1.414 1.414z" /></svg>;
export default SvgClose;