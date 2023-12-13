import React, { useContext, useState } from "react"
import { HiChevronDoubleLeft } from "react-icons/hi"
import { ControllerContext } from "./ControllerContext"

export default function EndProdMenuComponent({
  onClick,
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isOpen, setIsOpen] = useState<boolean>()
  const { variant, controllerDetailData } = useContext(ControllerContext)

  return (
    <div
      className={`absolute right-0 w-56 bottom-10 transition-all ${
        !isOpen ? "translate-x-[calc(100%-18px)]" : "translate-x-0"
      }`}
    >
      <div className="">
        <div className="border-[#5d5d5d] border-2 bg-[#0f2034] flex gap-1 rounded-l-lg border-r-0 mt-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`py-1 flex items-center justify-center w-[15px]`}
            style={{ writingMode: "vertical-lr" }}
          >
            <HiChevronDoubleLeft
              className={`w-3 h-3  transition-all ${
                !isOpen ? "rotate-0" : "rotate-180"
              } mx-auto mt-1 text-[#da8d00] font-bold`}
            />
          </button>
          <button
            onClick={onClick}
            className="border-[#da8d00] bg-[#bdbdbd] border-2 border-r-0 rounded-l-lg flex-1"
          >
            <div className="px-4 py-2 font-bold uppercase">END PRODUCTION</div>
          </button>
        </div>
      </div>
    </div>
  )
}
