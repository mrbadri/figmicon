import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrowArrowCircleLeft = ({
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
      d="m11 9-3 3m0 0 3 3m-3-3h8m5 0a9 9 0 1 0-18 0 9 9 0 0 0 18 0"
    />
  </svg>
);
SvgArrowArrowCircleLeft.displayName = "SvgArrowArrowCircleLeft";
export default SvgArrowArrowCircleLeft;
