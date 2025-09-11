import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgArrowArrowSubDownLeft = ({
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
      d="m11 11-5 5m0 0 5 5m-5-5h7.803c1.118 0 1.677 0 2.105-.218.376-.191.682-.498.874-.874.218-.428.218-.987.218-2.105V3"
    />
  </svg>
);
SvgArrowArrowSubDownLeft.displayName = "SvgArrowArrowSubDownLeft";
export default SvgArrowArrowSubDownLeft;
