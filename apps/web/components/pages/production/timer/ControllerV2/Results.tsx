import { Lato } from "next/font/google"
import FancyButtonComponent from "./FancyButton"
import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"
import StartButtonComponent from "./StartButton"
import ResultsUnitCountComponent from "./Results.UnitCount"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function ResultsBoardComponent() {
  const { totals } = useContext(ControllerContext)

  return (
    <div
      className={`flex flex-col justify-between h-full pt-4 ${lato.className}`}
    >
      <div className="justify-center flex-1 hidden lg:flex">
        <div>
          <StartButtonComponent />
        </div>
      </div>
      <div className="relative text-xs sm:text-xl">
        <div className="grid grid-cols-2 gap-1 ml-auto font-medium leading-tight w-fit text-normal">
          <div className="col-span-1 text-[#858585] text-right">
            {totals.unitsPerHour.toFixed(3)} :{" "}
          </div>
          <div className="col-span-1 text-[#0f2034] font-semibold">UNIT PH</div>
          <div className="col-span-1 text-[#858585] text-right">
            {totals.totalTons.toFixed(3)} :{" "}
          </div>
          <div className="col-span-1 text-[#0f2034] font-semibold">
            TOTAL TONS
          </div>
          <div className="col-span-1 text-[#858585] text-right">
            {totals.tonsPerHour.toFixed(3)} :{" "}
          </div>
          <div className="col-span-1 text-[#0f2034] font-semibold">TONS PH</div>
        </div>
        <div className="hidden sm:block">
          <ResultsUnitCountComponent />
        </div>
      </div>
    </div>
  )
}
