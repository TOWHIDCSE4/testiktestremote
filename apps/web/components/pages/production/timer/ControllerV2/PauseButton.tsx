import { useContext } from "react"
import FancyButtonComponent from "./FancyButton"
import { ControllerContext } from "./ControllerContext"

export default function PauseButtonComponent() {
  const { variant, isStopMenuOpen, setIsStopMenuOpen } =
    useContext(ControllerContext)
  const onClick = () => {
    setIsStopMenuOpen(!isStopMenuOpen)
  }
  return (
    <>
      <div className="sm:hidden">
        <FancyButtonComponent
          className="font-bold"
          size={"sm"}
          padding={"xs"}
          onClick={() => {
            onClick()
          }}
          intent={variant}
        >
          <div className="text-[3rem] px-2">P</div>
        </FancyButtonComponent>
      </div>
      <div className="hidden lg:block">
        <FancyButtonComponent
          className="font-bold"
          size={"sm"}
          padding={"xs"}
          onClick={() => {
            onClick()
          }}
          intent={variant}
        >
          <div className="text-[3rem] px-3">P</div>
        </FancyButtonComponent>
      </div>
      <div className="hidden sm:block lg:hidden">
        <FancyButtonComponent
          className="font-bold"
          size={"xs"}
          padding={"xs"}
          onClick={() => {
            onClick()
          }}
          intent={variant}
        >
          <div className="text-[2.2rem] px-2">P</div>
        </FancyButtonComponent>
      </div>
    </>
  )
}
