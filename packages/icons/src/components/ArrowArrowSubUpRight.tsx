import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrowArrowSubUpRight = ({
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
      d="m13 13 5-5m0 0-5-5m5 5h-7.8c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C7 9.52 7 10.08 7 11.2V21"
    />
  </svg>
);
SvgArrowArrowSubUpRight.displayName = "SvgArrowArrowSubUpRight";
export default SvgArrowArrowSubUpRight;
