import { useContext } from "react"
import FancyButtonComponent from "./FancyButton"
import { ControllerContext } from "./ControllerContext"

export default function PauseButtonComponent({
  onClick,
}: {
  onClick?: () => void
}) {
  const { variant } = useContext(ControllerContext)
  return (
    <FancyButtonComponent
      textSize={"lg"}
      className="font-bold"
      onClick={() => {
        onClick?.()
      }}
      intent={variant}
    >
      P
    </FancyButtonComponent>
  )
}
