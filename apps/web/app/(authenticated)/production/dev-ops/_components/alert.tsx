"use client"
import React, { useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { BsEye, BsPin } from "react-icons/bs"

interface Props {
  type: "success" | "error" | "warning" | "info"
  displayActions?: boolean
  onView?: () => void
  onDismiss?: () => void
  onPin?: () => void
}

const Alert: React.FC<Props> = ({
  type = "success",
  displayActions = true,
  onDismiss,
  onView,
  onPin,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const classes = {
    success: "border-green-300 text-green-800 bg-green-50",
    error: "border-red-300 text-red-800 bg-red-50",
    warning: "border-yellow-300 text-yellow-800 bg-yellow-50",
    info: "border-blue-300 text-blue-800 bg-blue-50",
  }

  const ButtonClass = {
    success:
      "text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center",
    error:
      "text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center",
    warning:
      "text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center",
    info: "text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center",
  }

  const dismissButtonClass = {
    success:
      "text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center",
    error:
      "text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center",
    warning:
      "text-yelloe-800 bg-transparent border border-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center",
    info: "text-blue-800 bg-transparent border border-blue-800 hover:bg-blue-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 text-center",
  }

  return (
    <div
      className={`flex items-center justify-between p-4 border-l-4 ${classes[type]}`}
    >
      <div className="flex items-center">
        <BiInfoCircle className="w-8 h-8 mr-2" />
        <h3 className="text-md font-semibold line-clamp-1 w-52">
          This is a info alert
        </h3>
        <div className={`text-sm ${isOpen ? "" : "line-clamp-1"}`}>
          More info about this info alert goes here. This example text is going
          to run a bit longer so that you can see how spacing within an alert
          works with this kind of content.
        </div>
      </div>
      {displayActions && (
        <div className="flex items-center w-96 space-x-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={ButtonClass[type]}
          >
            <BsEye className="w-3 h-3 mr-2" />
            {isOpen ? "View more" : "View less"}
          </button>
          <button onClick={onDismiss} className={dismissButtonClass[type]}>
            Dismiss
          </button>
          <button onClick={onPin} className={dismissButtonClass[type]}>
            <BsPin className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Alert
