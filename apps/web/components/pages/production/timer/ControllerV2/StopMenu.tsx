import { useContext, useState } from "react"
import { HiChevronDoubleLeft } from "react-icons/hi"
import { ControllerContext } from "./ControllerContext"
import useColor from "./useColor"

export default function StopMenuComponent({
  isOpen,
  toggleOpen,
}: {
  isOpen?: boolean
  toggleOpen: () => void
}) {
  const { variant, setStopReasons, onStopCycleWithReasons, stopReasons } =
    useContext(ControllerContext)
  const color = useColor({ variant })

  const stopReasonsArr = (
    [
      "Machine Error",
      "Machine Low",
      "Machine Cleaning",
      "Maintenance",
      "Change Part",
      "Personal Injury",
    ] as const
  ).map((v) => {
    if (v === "Machine Low") return "Material Low"
    return v
  })

  return (
    <div
      className={`absolute right-0 w-[270px] bottom-32 transition-all ${
        !isOpen ? "translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="border-[#5d5d5d] h-[190px] border-2 bg-[#0f2034] flex rounded-l-lg border-r-0">
        <button
          onClick={() => {
            toggleOpen()
          }}
          className="flex items-center px-1 text-center rotate-180"
        >
          <button className="flex items-center justify-center">
            <HiChevronDoubleLeft
              className={`transition-colors w-3 h-3 mx-auto mt-1 text-${color} font-bold`}
            />
          </button>
          <button
            className="text-sm font-semibold text-white"
            style={{ writingMode: "vertical-lr" }}
          >
            PAUSE PRODUCTION
          </button>
        </button>
        <div
          className={`transition-colors border-${color} bg-[#bdbdbd] border-2 border-r-0 rounded-l-lg flex-1`}
        >
          <div className="px-4 py-2">
            {stopReasonsArr.map((item, key) => (
              <div key={key} className="flex items-center gap-4">
                <input
                  type="checkbox"
                  name="machine-error"
                  checked={stopReasons.includes(item)}
                  onChange={(eve) => {}}
                  onClick={() => {
                    if (stopReasons.includes(item)) {
                      setStopReasons((prev: any) =>
                        prev.filter((cItem: any) => cItem !== item)
                      )
                    } else {
                      setStopReasons((prev: any[]) => [...prev, item])
                    }
                  }}
                  className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"
                />
                <label className="uppercase text-[#0f2034] text-normal font-medium">
                  {item}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-5">
            <p className="text-[#858585] italic text-sm">*Select One</p>
            <button
              onClick={onStopCycleWithReasons}
              className="border-2 border-[#90959b] bg-[#e8ebf0] leading-none rounded-lg text-[#0f2034] px-4 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
