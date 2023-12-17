import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"
import { bgCV } from "./classVariants"

export default function ProgressComponent() {
  const { variant, progress } = useContext(ControllerContext)
  const bgColors = bgCV

  return (
    <div className="w-full h-2 overflow-hidden !flex-shrink-0">
      <div
        className={`h-2 top-0 left-0 ${bgCV[variant]}`}
        style={{ width: `${variant == "idle" ? 100 : progress}%` }}
      ></div>
    </div>
  )
}
