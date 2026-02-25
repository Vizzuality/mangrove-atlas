import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArea = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fill="currentColor" fillRule="evenodd" d="M8.283 4.406a1.382 1.382 0 1 0 0 2.765 1.382 1.382 0 0 0 0-2.765M5.338 5.788a2.945 2.945 0 1 1 3.021 2.944l-1.758 8.791a2.96 2.96 0 0 1 1.507 1.534l8.829-.883a2.94 2.94 0 0 1 1.052-1.71l-.663-1.987a2.945 2.945 0 1 1 1.442-.614l.663 1.987a2.945 2.945 0 1 1-2.393 3.884l-8.722.873a2.945 2.945 0 1 1-3.26-3.32l1.785-8.93a2.94 2.94 0 0 1-1.503-2.569m.06 13.041a1.382 1.382 0 1 0 0 2.765 1.382 1.382 0 0 0 0-2.765m13.041-.06a1.382 1.382 0 1 1 2.764 0 1.382 1.382 0 0 1-2.764 0m-1.503-8.593a1.382 1.382 0 1 0 0 2.764 1.382 1.382 0 0 0 0-2.764" clipRule="evenodd" /></svg>;
export default SvgArea;