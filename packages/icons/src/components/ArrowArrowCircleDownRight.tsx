import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrowArrowCircleDownRight = ({
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
      d="M11 15h4m0 0v-4m0 4L9 9m12 3a9 9 0 1 0-18 0 9 9 0 0 0 18 0"
    />
  </svg>
);
SvgArrowArrowCircleDownRight.displayName = "SvgArrowArrowCircleDownRight";
export default SvgArrowArrowCircleDownRight;
