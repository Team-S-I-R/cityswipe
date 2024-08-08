import * as React from "react"
import { SVGProps } from "react"
const BadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={24}
    fill="currentColor"
    {...props}
  >
    <path d="M22.667 6.8a1.326 1.326 0 0 0 0-1.875l-1.983-1.983a1.325 1.325 0 0 0-1.874 0l-4.873 4.873a1.326 1.326 0 0 1-1.874 0L7.19 2.942a1.326 1.326 0 0 0-1.875 0L3.333 4.925a1.326 1.326 0 0 0 0 1.875l4.872 4.872a1.326 1.326 0 0 1 0 1.875L3.333 18.42a1.326 1.326 0 0 0 0 1.874l1.982 1.983a1.326 1.326 0 0 0 1.875 0l4.873-4.873a1.325 1.325 0 0 1 1.874 0l4.873 4.873a1.325 1.325 0 0 0 1.875 0l1.982-1.983a1.326 1.326 0 0 0 0-1.874l-4.872-4.873a1.325 1.325 0 0 1 0-1.875L22.667 6.8Z" />
  </svg>
)
export default BadIcon
