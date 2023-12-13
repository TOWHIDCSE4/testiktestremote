import Image from "next/image"
import React, { RefObject, useContext, useRef } from "react"
import LogoGreen from "../../../../../assets/logo/logo-green.png"
import LogoRed from "../../../../../assets/logo/logo-red.png"
import LogoGold from "../../../../../assets/logo/logo-gold.png"
import { MdClose } from "react-icons/md"
import { BiFullscreen } from "react-icons/bi"
import useControllerModal from "../../../../../store/useControllerModal"
import { QueueListIcon } from "@heroicons/react/20/solid"
import { ControllerContext } from "./ControllerContext"

import { LuMaximize, LuMenu, LuMoon } from "react-icons/lu"
import { hourMinuteSecond } from "../../../../../helpers/timeConverter"

const Header = ({
  isLoading,
  locationName,
  setOpenTimerLogs,
  onClose,
  onFullScreen,
}: {
  isLoading: boolean
  locationName: string
  setOpenTimerLogs: (val: boolean) => void
  onClose: () => void
  onFullScreen: () => void
}) => {
  const { timerLogs, controllerClockSeconds, variant, progress } =
    useContext(ControllerContext)
  const controllerClockArray = hourMinuteSecond(controllerClockSeconds)

  const [mode, setMode] = React.useState("")
  const toggleTheme = () => {
    if (mode === "Dark") {
      document.documentElement.classList.remove("dark")
      setMode("Light")
    } else {
      document.documentElement.classList.add("dark")
      setMode("Dark")
    }
  }

  return (
    <div className="relative flex items-center justify-between w-full py-5 text-white px-9 bg-dark-blue ">
      <div>
        <Image
          src={
            variant == "idle"
              ? LogoGold
              : variant == "active"
              ? LogoGreen
              : LogoRed
          }
          alt="logo-gold"
          height={75}
          className="h-[72px]"
        />
      </div>
      <div className="flex items-center justify-center flex-1 gap-5">
        <button
          onClick={() => setOpenTimerLogs(true)}
          className="flex items-center justify-center text-xl text-black bg-white rounded-lg w-9 h-9"
        >
          <LuMenu />
        </button>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center text-xl text-black bg-white rounded-lg w-9 h-9"
        >
          <LuMoon />
        </button>
        <button
          onClick={onFullScreen}
          className="flex items-center justify-center text-xl text-black bg-white rounded-lg w-9 h-9"
        >
          <BiFullscreen />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold uppercase">
          {isLoading ? (
            <div className="flex space-x-4 animate-pulse">
              <div className="rounded h-7 w-36 bg-slate-200"></div>
            </div>
          ) : (
            <>{locationName}</>
          )}
        </div>
        <div className="text-lg">
          PRODUCTION TIME: {controllerClockArray[0]}: {controllerClockArray[1]}:
          {controllerClockArray[2]}
        </div>
      </div>
      <button className="absolute right-2 top-2" onClick={() => onClose()}>
        <MdClose onClick={() => onClose()} size={24} color="white" />
      </button>
      <div className="absolute bottom-0 left-0 w-full h-4 overflow-hidden">
        {!progress || progress == 0 ? (
          <></>
        ) : (
          <div
            className={`h-4 w-[${progress}]% bg-${
              variant == "idle"
                ? "yellow-700"
                : variant == "danger"
                ? "red-600"
                : "green-600"
            }`}
          ></div>
        )}
      </div>
    </div>
  )
}

export default Header
