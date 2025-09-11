import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrowArrowCircleUp = ({
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
      d="m15 11-3-3m0 0-3 3m3-3v8m9-4a9 9 0 1 0-18 0 9 9 0 0 0 18 0"
    />
  </svg>
);
SvgArrowArrowCircleUp.displayName = "SvgArrowArrowCircleUp";
export default SvgArrowArrowCircleUp;
