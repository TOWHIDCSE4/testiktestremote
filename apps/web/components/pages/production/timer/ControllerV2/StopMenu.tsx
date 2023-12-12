import { useState } from "react"
import { HiChevronDoubleLeft } from "react-icons/hi"

export default function StopMenuComponent({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean
  toggleOpen: () => void
}) {
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div
      className={`absolute right-0 w-[270px] bottom-32 transition-all ${
        isOpen ? "translate-x-full" : "translate-x-0"
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
            <HiChevronDoubleLeft className="w-3 h-3 mx-auto mt-1 text-[#da8d00] font-bold" />
          </button>
          <p
            className="text-sm font-semibold text-white"
            style={{ writingMode: "vertical-lr" }}
          >
            PAUSE PRODUCTION
          </p>
        </button>
        <div className="border-[#da8d00] bg-[#bdbdbd] border-2 border-r-0 rounded-l-lg flex-1">
          <div className="px-4 py-2">
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"></span>
              <label className="uppercase text-[#0f2034] text-normal font-medium">
                MACHINE CLEANING
              </label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"></span>
              <label className="uppercase text-[#0f2034] text-normal font-medium">
                CHANGE PART
              </label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"></span>
              <label className="uppercase text-[#0f2034] text-normal font-medium">
                MAINTENANCE
              </label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"></span>
              <label className="uppercase text-[#0f2034] text-normal font-medium">
                MATERIAL LOW
              </label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"></span>
              <label className="uppercase text-[#0f2034] text-normal font-medium">
                PERSONAL INJURY
              </label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-3 h-3 bg-white border border-[#0f2034] rounded-full"></span>
              <label className="uppercase text-[#0f2034] text-normal font-medium">
                MACHINE ERROR
              </label>
            </div>
          </div>
          <div className="flex justify-between px-5">
            <p className="text-[#858585] italic text-sm">*Select One</p>
            <button className="border-2 border-[#90959b] bg-[#e8ebf0] leading-none rounded-lg text-[#0f2034] px-4 font-semibold">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
