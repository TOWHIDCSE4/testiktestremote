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
    <footer className="relative w-full">
      <div className="relative w-full overflow-hidden progress-bar">
        <div
          className={`${progress > 100 ? "bg-red-600" : "bg-green-500"} h-4`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex flex-row items-center justify-between px-12 pt-5 pb-5">
        <h4 className="font-semibold uppercase text-blue-950 dark:text-white">
          Developed By IEKOMEDIA
        </h4>
        <h4 className="font-semibold uppercase text-blue-950 dark:text-white">
          <ControllerDateTime timeZone={!isLoading ? timeZone : ""} />
        </h4>
      </div>
    </footer>
  )
}

export default Footer
