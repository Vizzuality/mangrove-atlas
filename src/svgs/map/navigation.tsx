import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgNavigation = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<g clipPath="url(#a)"><path fillRule="evenodd" d="M76.136 19.732 16.811 44.539l27.824 1.31.633.256a8.14 8.14 0 0 1 4.495 4.495l.256.633 1.31 27.824zm7.382 3.085c2.742-6.553-3.838-13.302-10.484-10.46L13.257 37.356c-6.678 2.796-6.432 12.239.205 14.826l.61.238 28.057 1.32 1.319 28.036.224.593c2.57 6.797 12.079 6.84 14.842.244l25.003-59.793z" clipRule="evenodd" /></g><defs><clipPath><path d="M0 0h96v96H0z" /></clipPath></defs></svg>;
export default SvgNavigation;