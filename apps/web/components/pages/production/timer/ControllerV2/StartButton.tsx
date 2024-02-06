import { useContext } from "react"
import FancyButtonComponent from "./FancyButton"
import { ControllerContext } from "./ControllerContext"

export default function StartButtonComponent({
  onClick,
}: {
  onClick?: () => void
}) {
  const {
    variant,
    totals,
    isCycleClockRunning,
    isJobsLoading,
    isControllerJobLoading,
    isChangingJob,
    unitCreated,
    onToggleStart,
    isStopDisabled,
  } = useContext(ControllerContext)
  return (
    <FancyButtonComponent
      padding={"md"}
      textSize={"none"}
      className="font-bold uppercase"
      onClick={onClick ?? onToggleStart}
      disabled={isJobsLoading || isControllerJobLoading || isStopDisabled}
      trigger={"on"}
      intent={variant}
    >
      <div className="text-[2rem] sm:text-[3rem]">
        {isChangingJob
          ? // "Changing controller job"
            "..."
          : isControllerJobLoading
          ? // "Assigning Job to Controller"
            "..."
          : isJobsLoading
          ? // `Loading Controller Jobs`
            "..."
          : isCycleClockRunning
          ? `Stop`
          : `Start`}
      </div>
    </FancyButtonComponent>
  )
}
