"use client"
import { Disclosure } from "@headlessui/react"
import React, { useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { BsEye, BsPin } from "react-icons/bs"

interface Props {
  type: "success" | "error" | "warning" | "info"
  displayActions?: boolean
  heading: string
  description: string
}

const Alert: React.FC<Props> = ({
  type,
  displayActions = true,
  heading,
  description,
}) => {
  console.log("🚀 ~ type:", type)
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
    <Disclosure>
      {({ close, open }) => {
        return (
          <>
            <div
              className={`flex items-center justify-between p-4 border-l-4 ${classes[type]}`}
            >
              <div className="flex items-center">
                <BiInfoCircle className="w-8 h-8 mr-2" />
                <h3 className="text-md font-semibold line-clamp-1 w-52">
                  {heading}
                </h3>
                <div className="text-sm line-clamp-1">{description}</div>
              </div>
              {displayActions && (
                <div className="flex items-center justify-end w-96 space-x-2">
                  <Disclosure.Button className={ButtonClass[type]}>
                    <BsEye className="w-3 h-3 mr-2" />
                    {open ? "View Less" : "View more"}
                  </Disclosure.Button>
                  <button className={dismissButtonClass[type]}>Dismiss</button>
                  <button className={dismissButtonClass[type]}>
                    <BsPin className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <Disclosure.Panel className={`text-sm p-8 ${classes[type]}`}>
              {description}
            </Disclosure.Panel>
          </>
        )
      }}
    </Disclosure>
  )
}

export default Alert
