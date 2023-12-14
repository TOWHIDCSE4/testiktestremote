import { useContext, useEffect, useRef } from "react"
import { ControllerContext } from "./ControllerContext"
import useColor from "./useColor"
import dayjs from "dayjs"
import TimerLogsModal from "../modals/TimerLogsModalV2"

export default function ConsoleComponent({
  isLogsOpen,
  setIsLogsOpen,
}: {
  isLogsOpen: boolean
  setIsLogsOpen: (val: boolean) => void
}) {
  const { variant, setReadingsDivRef, readingMessages } =
    useContext(ControllerContext)
  const color = useColor({ variant })

  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setReadingsDivRef(messagesRef)
  }, [setReadingsDivRef])

  return (
    <div className="relative flex flex-col justify-between flex-1">
      <div className="absolute top-0 w-full -translate-y-full">
        <div className="flex items-end justify-between w-full overflow-x-auto overflow-y-hidden flex-nowrap">
          <div className="w-16 border-b border-dark-blue"></div>
          <button
            onClick={() => {
              setIsLogsOpen(true)
            }}
            className={`flex items-center flex-shrink-0 px-5 py-2 space-x-2 rounded-t-lg ${
              !isLogsOpen
                ? `bg-${color} border-b`
                : `bg-transparent border border-b-0`
            } border-dark-blue`}
          >
            <span>Logs</span>
          </button>
          <button
            onClick={() => {
              setIsLogsOpen(false)
            }}
            className={`flex items-center flex-shrink-0 px-5 py-2 space-x-2 rounded-t-lg ${
              isLogsOpen
                ? `bg-${color} border-b`
                : `bg-transparent border border-b-0`
            } border-dark-blue`}
          >
            <span>Readings</span>
          </button>
          <div className="flex-1 border-b border-dark-blue"></div>
        </div>
      </div>
      <div className="relative border-b-[1px] flex-1 border-[#0f2034] overflow-hidden">
        {isLogsOpen ? (
          <TimerLogsModal isOpen={isLogsOpen} setIsOpen={setIsLogsOpen} />
        ) : (
          <div
            ref={messagesRef}
            className="absolute w-full h-full p-5 overflow-auto text-xs"
          >
            {readingMessages?.map((message, key) => (
              <p key={key}>{message}</p>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 justify-between px-[90px] text-sm font-light">
        <p>DEVELOPED BY IEKOMEDIA</p>
        <p>{dayjs().format("MMMM YYYY-DD HH:mm:ss")}</p>
      </div>
    </div>
  )
}
