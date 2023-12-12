import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"

export default function ConsoleComponent() {
  const { variant } = useContext(ControllerContext)
  return (
    <div className="relative flex flex-col justify-between flex-1">
      <div className="absolute top-0 -translate-y-full h-1 w-full bg-[#0f2034]"></div>
      <div className="absolute top-0 -translate-y-full left-16">
        <div className="rounded-t-lg border-2 border-[#5d5d5d] border-b-0 bg-[#da8d00] text-xl text-[#0f2034] font-normal uppercase flex w-fit">
          <div className="bg-[#e9ecf1] border-4 border-b-0 border-[#0f2034] rounded-t-md px-4 py-1 leading-none -mt-[2px] -mx-[2px]">
            READINGS
          </div>
          <div className="px-2 py-1 leading-none border-4 border-b-0 border-transparent -mt-[2px] -mx-[2px]">
            LOGS
          </div>
        </div>
      </div>
      <div className="relative border-b-[4px] p-5 flex-1 border-[#0f2034]">
        <div className="absolute w-full h-full overflow-auto">
          Starting timer
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between px-[90px] text-sm font-light">
        <p>DEVELOPED BY IEKOMEDIA</p>
        <p>December 12, 2023 - 9:19 PM</p>
      </div>
    </div>
  )
}
