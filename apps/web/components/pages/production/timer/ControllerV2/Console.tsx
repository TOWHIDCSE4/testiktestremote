import { useContext, useEffect, useRef } from "react"
import { ControllerContext } from "./ControllerContext"
import useColor from "./useColor"

export default function ConsoleComponent() {
  const { variant, setReadingsDivRef, readingMessages } =
    useContext(ControllerContext)
  const color = useColor({ variant })

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setReadingsDivRef(messagesRef)
  }, [setReadingsDivRef])

  return (
    <div className="relative flex flex-col justify-between flex-1">
      <div className="absolute top-0 -translate-y-full h-[1px] w-full bg-stone-500"></div>
      <div className="absolute top-0 flex -translate-y-full left-16">
        <div className="relative flex items-end h-12">
          <div
            className={`bg-${color} rounded-t-lg z-0 border-[1px] border-stone-500 px-4 py-2 leading-none -mt-[2px] -mx-[2px]`}
          >
            Logs
          </div>
          <div className="bg-white shadow-lg rounded-t-lg z-0 border-[1px] border-b-white border-stone-500 px-4 py-2 leading-none -mt-[2px] -mx-[2px]">
            READINGS
          </div>
        </div>
      </div>
      <div className="relative border-b-[1px] p-5 flex-1 border-[#0f2034]">
        <div
          ref={messagesRef}
          className="absolute w-full h-full overflow-auto text-xs"
        >
          {readingMessages?.map((message, key) => (
            <p key={key}>{message}</p>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 justify-between px-[90px] text-sm font-light">
        <p>DEVELOPED BY IEKOMEDIA</p>
        <p>December 12, 2023 - 9:19 PM</p>
      </div>
    </div>
  )
}
