import Image from "next/image"
import React, { RefObject, useContext, useRef } from "react"
import LogoGreen from "../../../../../assets/logo/logo-green.png"
import LogoRed from "../../../../../assets/logo/logo-red.png"
import LogoGold from "../../../../../assets/logo/logo-gold.png"
import { MdClose } from "react-icons/md"
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi"
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
}: {
  isLoading: boolean
  locationName: string
  setOpenTimerLogs: (val: boolean) => void
  onClose: () => void
}) => {
  const { timerLogs, controllerClockSeconds, variant, progress } =
    useContext(ControllerContext)

  const { isMaximized, setIsMaximized } = useControllerModal()

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
    <div className="relative flex flex-wrap items-center justify-between w-full px-3 py-2 pb-16 text-white sm:pb-10 lg:pb-6 lg:py-5 lg:px-9 bg-dark-blue ">
      {/* IMAGE */}
      <div className="flex-1 hidden sm:block">
        <Image
          src={
            variant == "idle"
              ? LogoGold
              : variant == "active"
              ? LogoGreen
              : LogoRed
          }
          alt="logo-gold"
          height={72}
          className="h-[60px] lg:h-[72px] object-contain"
        />
      </div>
      {/* BUTTONS */}
      <div className="absolute w-full -ml-3 bottom-5 lg:bottom-10">
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setOpenTimerLogs(true)}
            className="flex items-center justify-center text-xl text-black bg-white rounded-xl w-9 h-9"
          >
            <LuMenu />
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center text-xl text-black bg-white rounded-xl w-9 h-9"
          >
            <LuMoon />
          </button>
          <button
            onClick={() => {
              setIsMaximized(!isMaximized)
            }}
            className="flex items-center justify-center text-xl text-black bg-white rounded-xl w-9 h-9"
          >
            {isMaximized ? <BiExitFullscreen /> : <BiFullscreen />}
          </button>
        </div>
      </div>
      {/* TITLE */}
      <div className="flex items-center justify-center flex-1 sm:justify-end">
        <div className="flex flex-col items-center justify-center ">
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
            PRODUCTION TIME: {controllerClockArray[0]}:{" "}
            {controllerClockArray[1]}:{controllerClockArray[2]}
          </div>
        </div>
      </div>
      {/* CLOSE BUTTON */}
      <button className="absolute right-2 top-2" onClick={() => onClose()}>
        <MdClose onClick={() => onClose()} size={24} color="white" />
      </button>
    </div>
  )
}

export default Header
