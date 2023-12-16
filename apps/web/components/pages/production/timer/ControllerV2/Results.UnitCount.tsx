import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"

export default function ResultsUnitCountComponent() {
  const { unitCreated } = useContext(ControllerContext)
  return (
    <>
      <div className="flex justify-center w-full sm:pr-8 sm:justify-end">
        <div className="text-xl sm:text-2xl text-[#0f2034] dark:text-white uppercase font-extrabold">
          TOTAL UNITS
        </div>
      </div>
      <div className="font-bold text-[8rem] sm:text-[12rem] text-center leading-none -mt-4">
        {unitCreated < 100 && (
          <span className="text-[#bdbdbd] dark:text-white dark:opacity-30 leading-none">
            0
          </span>
        )}
        {unitCreated < 10 && (
          <span className="text-[#bdbdbd] dark:text-white dark:opacity-30 leading-none">
            0
          </span>
        )}
        {unitCreated == 0 ? (
          <span className="text-[#bdbdbd] dark:text-white dark:opacity-30 leading-none">
            0
          </span>
        ) : (
          <span className="text-[#0f2034] dark:text-white leading-none">
            {unitCreated}
          </span>
        )}
      </div>
    </>
  )
}
