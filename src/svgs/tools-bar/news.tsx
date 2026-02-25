import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgNews = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#fff" fillRule="evenodd" d="M4.5 2.25A2.25 2.25 0 0 0 2.25 4.5v15a2.25 2.25 0 0 0 2.25 2.25h15a2.25 2.25 0 0 0 2.25-2.25V9.235a.985.985 0 0 0-.985-.985H18.75V4.5a2.25 2.25 0 0 0-2.25-2.25zM20.25 19.5a.75.75 0 0 1-1.5 0V9.75h1.5zm-3-7.5V4.5a.75.75 0 0 0-.75-.75h-12a.75.75 0 0 0-.75.75v15c0 .414.336.75.75.75h12.878a2.3 2.3 0 0 1-.128-.75zM6 5.25a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3A.75.75 0 0 0 9.75 9V6A.75.75 0 0 0 9 5.25zm.75 3v-1.5h1.5v1.5zm-.75 3a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5zM5.25 15a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75M6 17.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z" clipRule="evenodd" /></svg>;
export default SvgNews;