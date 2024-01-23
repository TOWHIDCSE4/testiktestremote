import { T_MachineClass } from "custom-validator"
import { useState } from "react"
import _ from "lodash"
import useGetLocationTotals from "../../../hooks/timers/useGetLocationTotals"

export default function MachineClassSelectComponent({
  machineClasses,
  location,
}: {
  machineClasses: T_MachineClass[]
  location: {
    _id?: string
    name: string
  }
}) {
  const { data: locationsTotals } = useGetLocationTotals()
  const t = locationsTotals?.item?.find((item: any) => item._id == location._id)
  console.log("[TTTT]", t)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  return (
    <>
      <div
        className={`absolute max-w-full overflow-auto left-[50%] -translate-x-[50%] bottom-0 transition-all ${
          !isMenuOpen ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="relative flex flex-col px-4 py-2 pb-16 overflow-auto bg-white scrollbar-w-xs h-72">
          <div className="flex justify-between w-full gap-1">
            <div>
              <input name={location.name + "machineClass"} type="radio" />
            </div>
            <div className="flex-1 line-clamp-1">All</div>
          </div>
          {machineClasses?.map((mc: T_MachineClass, idx: number) => (
            <div key={idx} className="flex justify-between w-full gap-1">
              <div>
                <input name={location.name + "machineClass"} type="radio" />
              </div>
              <div className="flex-1 line-clamp-1">{mc.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[50%] -translate-x-[50%] bottom-0">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex gap-2 p-1 mx-auto text-lg font-bold text-green-700 uppercase bg-white border border-b-0 rounded-t-lg lg:text-xs w-fit border-slate-600 whitespace-nowrap "
        >
          <div>Total Units: {t?.totalUnits}</div>
          <div>Total Tons: {t?.totalTons?.toFixed(2)}</div>
        </button>
      </div>
    </>
  )
}
