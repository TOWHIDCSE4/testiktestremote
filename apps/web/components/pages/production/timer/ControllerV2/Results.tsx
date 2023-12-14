import { Lato } from "next/font/google"
import FancyButtonComponent from "./FancyButton"
import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "block",
  subsets: ["latin", "latin-ext"],
})

export default function ResultsBoardComponent() {
  const isCycleClockStarting = false
  const isAbleToStart = true
  const {
    variant,
    onToggleStart,
    totals,
    isCycleClockRunning,
    isJobsLoading,
    isControllerJobLoading,
    isChangingJob,
    unitCreated,
    isStopDisabled,
  } = useContext(ControllerContext)

  return (
    <div className={`flex flex-col justify-between pt-4 ${lato.className}`}>
      <div className="flex justify-center">
        <FancyButtonComponent
          padding={"md"}
          textSize={"lg"}
          className="font-bold uppercase"
          onClick={onToggleStart}
          disabled={isJobsLoading || isControllerJobLoading || isStopDisabled}
          trigger={"on"}
          intent={variant}
        >
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
        </FancyButtonComponent>
      </div>
      <div className="">
        <div className="grid grid-cols-12 gap-1 font-medium leading-tight text-normal">
          <div className="col-span-6 text-[#858585] text-right">
            {totals.unitsPerHour.toFixed(3)} :{" "}
          </div>
          <div className="col-span-6 text-[#0f2034] font-semibold">UNIT PH</div>
          <div className="col-span-6 text-[#858585] text-right">
            {totals.totalTons.toFixed(3)} :{" "}
          </div>
          <div className="col-span-6 text-[#0f2034] font-semibold">
            TOTAL TONS
          </div>
          <div className="col-span-6 text-[#858585] text-right">
            {totals.tonsPerHour.toFixed(3)} :{" "}
          </div>
          <div className="col-span-6 text-[#0f2034] font-semibold">TONS PH</div>
        </div>
        <div className="grid w-full grid-cols-12">
          <div className="col-span-4"></div>
          <div className="col-span-8 text-xl text-[#0f2034] uppercase font-extrabold">
            TOTAL UNITS
          </div>
        </div>
        <div className="font-bold text-[12rem] leading-none -mt-4">
          {unitCreated < 100 && (
            <span className="text-[#bdbdbd] leading-none">0</span>
          )}
          {unitCreated < 10 && (
            <span className="text-[#bdbdbd] leading-none">0</span>
          )}
          {unitCreated == 0 ? (
            <span className="text-[#bdbdbd] leading-none">0</span>
          ) : (
            <span className="text-[#0f2034] leading-none">{unitCreated}</span>
          )}
        </div>
      </div>
    </div>
  )
}
