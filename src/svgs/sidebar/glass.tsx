import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgGlass = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fillRule="evenodd" d="M15.009 5.969a5.766 5.766 0 1 1-4.002 9.918l-.15-.15a5.766 5.766 0 0 1 4.152-9.768M9.304 16.336a7.329 7.329 0 1 1 1.105 1.105l-5.222 5.22-1.104-1.104z" clipRule="evenodd" /></svg>;
export default SvgGlass;