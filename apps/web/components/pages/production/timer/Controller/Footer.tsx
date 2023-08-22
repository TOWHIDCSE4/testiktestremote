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
    <footer className="fixed bg-white w-full bottom-0">
      <div className="progress-bar">
        <div
          className={`${progress > 100 ? "bg-red-600" : "bg-green-500"} h-4`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex px-12 pb-7 pt-3 md:pb-5 md:pt-5 flex-col md:flex-row justify-between items-center">
        <h4 className="uppercase text-blue-950 font-semibold">
          Developed By IEKOMEDIA
        </h4>
        <h4 className="uppercase text-blue-950 font-semibold">
          <ControllerDateTime timeZone={!isLoading ? timeZone : ""} />
        </h4>
      </div>
    </footer>
  )
}

export default Footer
