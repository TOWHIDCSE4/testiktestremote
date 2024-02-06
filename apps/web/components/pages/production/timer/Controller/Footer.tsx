import React from "react"
import ControllerDateTime from "./DateTime"

const Footer = ({
  progress,
  isLoading,
  timeZone,
}: {
  progress: number
  isLoading: boolean
  timeZone: string
}) => {
  return (
    <footer className="absolute bottom-0 w-full bg-white">
      <div className="relative w-full overflow-hidden progress-bar">
        <div
          className={`${progress > 100 ? "bg-red-600" : "bg-green-500"} h-4`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-col items-center justify-between px-12 pt-3 pb-7 md:pb-5 md:pt-5 2xl:pt-2 2xl:pb-2 md:flex-row">
        <h4 className="font-semibold uppercase text-blue-950 xl:text-xl 2xl:text-xl">
          Developed By IEKOMEDIA
        </h4>
        <h4 className="font-semibold uppercase text-blue-950 xl:text-xl 2xl:text-xl">
          <ControllerDateTime timeZone={!isLoading ? timeZone : ""} />
        </h4>
      </div>
    </footer>
  )
}

export default Footer
