import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgShow = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fillRule="evenodd" d="M3.25 2.28a1 1 0 0 0-1.415 1.415l14 14a1 1 0 0 0 1.414-1.414l-1.473-1.473a10 10 0 0 0 3.308-4.82c-1.274-4.057-5.064-7-9.542-7A9.96 9.96 0 0 0 5.03 4.062zm4.26 4.26 1.514 1.516a2.003 2.003 0 0 1 2.45 2.45l1.514 1.514A4 4 0 0 0 7.51 6.542z" clipRule="evenodd" /><path d="M11.996 16.684 9.292 13.98a4 4 0 0 1-3.742-3.74L1.877 6.565A10 10 0 0 0 0 9.987c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.104 2.454-.302z" /></svg>;
export default SvgShow;