import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgUpload = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="#fff" fillRule="evenodd" d="M16.648 6.279a.893.893 0 0 0-1.296 0l-5.834 6.06a.98.98 0 0 0 0 1.348.89.89 0 0 0 1.297 0l4.268-4.435v11.986h1.834V9.252l4.268 4.435a.89.89 0 0 0 1.297 0 .98.98 0 0 0 0-1.347zM6.833 19.333v-.952H5v3.81C5 24.294 6.642 26 8.667 26h14.666C25.358 26 27 24.294 27 22.19v-3.809h-1.833v3.81c0 1.051-.821 1.904-1.834 1.904H8.667c-1.013 0-1.834-.853-1.834-1.904z" clipRule="evenodd" /></svg>;
export default SvgUpload;