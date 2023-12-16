import { useContext, useState } from "react"
import { HiChevronDoubleDown, HiChevronDoubleLeft } from "react-icons/hi"
import { ControllerContext } from "./ControllerContext"
import { borderCV, textCV } from "./classVariants"

export default function StopMenuComponent({
  isOpen,
  toggleOpen,
}: {
  isOpen?: boolean
  toggleOpen: () => void
}) {
  const { variant, setStopReasons, onStopCycleWithReasons, stopReasons } =
    useContext(ControllerContext)
  const textColors = textCV
  const borderColors = borderCV

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
      <div
        className={`relative border-[#5d5d5d] border-2 bg-[#0f2034] flex rounded-l-lg border-r-0`}
      >
        <button
          onClick={() => {
            toggleOpen()
          }}
          className="w-10 overflow-hidden"
          tabIndex={-1}
        >
          <div className="relative flex flex-col items-center justify-center h-full px-1 text-center -rotate-90">
            <div className="text-sm font-semibold text-white left-7">
              <div className="w-40 break-keep">PAUSE PRODUCTION</div>
            </div>
            <HiChevronDoubleDown
              className={`transition-colors w-3 h-3 mx-auto mt-1 ${textColors[variant]} font-bold`}
            />
          </div>
        </button>
        <div
          className={`transition-colors ${borderColors[variant]} bg-[#bdbdbd] dark:bg-transparent dark:text-white border-2 border-r-0 rounded-l-lg flex-1 !flex-shrink-0 py-1`}
        >
          <div className="px-4 py-0">
            {stopReasonsArr.map((item, key) => (
              <div key={key} className="flex items-center gap-4">
                <input
                  type="radio"
                  name="machine-error"
                  checked={stopReasons.includes(item)}
                  onChange={(eve) => {}}
                  onClick={() => {
                    setStopReasons([item])
                    // if (stopReasons.includes(item)) {
                    //   setStopReasons((prev: any) =>
                    //     prev.filter((cItem: any) => cItem !== item)
                    //   )
                    // } else {
                    //   setStopReasons((prev: any[]) => [...prev, item])
                    // }
                  }}
                  tabIndex={-1}
                  className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"
                />
                <label className="uppercase text-[#0f2034] dark:text-white font-bold">
                  {item}
                </label>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-6">
            <p className="text-[#858585] italic text-sm">*Select One</p>
            <button
              onClick={() => {
                onStopCycleWithReasons()
                toggleOpen()
              }}
              tabIndex={-1}
              className="border-2 border-[#90959b] bg-[#e8ebf0] leading-none rounded-lg text-[#0f2034] text-2xl px-3 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
