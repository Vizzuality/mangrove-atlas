import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgInfo = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" aria-labelledby={titleId} {...props}>{title ? <title id={titleId}>{title}</title> : null}<rect width={28} height={28} x={1} y={1} stroke="#00857F" strokeWidth={2} opacity={0.2} rx={14} /><path fill="#00857F" d="m18.3 20.604-.214.878q-.967.38-1.543.577-.576.204-1.338.205-1.172 0-1.826-.567a1.87 1.87 0 0 1-.645-1.455q0-.342.05-.693.048-.361.155-.81l.801-2.852q.107-.41.176-.772.078-.37.078-.674 0-.546-.224-.761-.225-.215-.86-.215a2.3 2.3 0 0 0-.644.098q-.322.098-.557.185l.215-.879a19 19 0 0 1 1.514-.547 4.4 4.4 0 0 1 1.367-.234q1.161 0 1.787.566.635.556.635 1.455 0 .186-.05.655a4.2 4.2 0 0 1-.155.859l-.801 2.842a8 8 0 0 0-.176.781 4 4 0 0 0-.078.664q0 .567.254.772.254.204.879.205.292 0 .664-.098.37-.107.537-.186m.206-11.924q0 .741-.567 1.27-.556.517-1.347.517t-1.358-.518q-.566-.527-.566-1.27 0-.741.566-1.269t1.358-.527q.79 0 1.348.527.566.528.566 1.27" /></svg>;
export default SvgInfo;