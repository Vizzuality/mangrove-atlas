import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgMapSettings = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<path fillRule="evenodd" d="M20.663 3.124A.75.75 0 0 1 21 3.75V18a.75.75 0 0 1-.455.69l-5.25 2.25a.75.75 0 0 1-.558.012l-5.718-2.144-4.974 2.131A.75.75 0 0 1 3 20.25V6c0-.3.179-.571.455-.69l5.25-2.25a.75.75 0 0 1 .558-.012l5.718 2.144 4.974-2.131a.75.75 0 0 1 .708.063M4.5 6.494l3.75-1.607v12.619L4.5 19.113zm9.75 12.674-4.5-1.688V4.832l4.5 1.688zm1.5-.055 3.75-1.607V4.887l-3.75 1.608z" clipRule="evenodd" /></svg>;
export default SvgMapSettings;