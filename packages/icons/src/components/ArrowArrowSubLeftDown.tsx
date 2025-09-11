import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrowArrowSubLeftDown = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m13.5 12.5-5 5m0 0-5-5m5 5V9.7c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874.428-.218.988-.218 2.108-.218h9.8"
    />
  </svg>
);
SvgArrowArrowSubLeftDown.displayName = "SvgArrowArrowSubLeftDown";
export default SvgArrowArrowSubLeftDown;
