"use client"
import { Disclosure } from "@headlessui/react"
import React from "react"
import { BsClockHistory, BsEye } from "react-icons/bs"

interface Props {
  displayActions?: boolean
  heading: string
  description: string
}

const Simulation: React.FC<Props> = ({
  displayActions = true,
  heading,
  description,
}) => {
  return (
    <Disclosure>
      {({ close, open }) => {
        return (
          <>
            <div className="flex items-center justify-between p-4 border-l-4 border-gray-300 text-gray-800 bg-gray-100">
              <div className="flex items-center">
                <BsClockHistory className="w-5 h-5 mr-2" />
                <h3 className="text-md font-semibold line-clamp-1 w-56 ellipsis mr-10">
                  {heading}
                </h3>
                <div className="text-sm line-clamp-1">{description}</div>
              </div>
              {displayActions && (
                <div className="flex items-center justify-end w-96 space-x-2">
                  <Disclosure.Button className="text-white bg-gray-600 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center">
                    <BsEye className="w-3 h-3 mr-2" />
                    {open ? "Hide Details" : "Show Details"}
                  </Disclosure.Button>
                  <Disclosure.Button className="text-white bg-gray-600 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center">
                    <BsClockHistory className="w-3 h-3 mr-2" />
                    Re-run Simulation
                  </Disclosure.Button>
                </div>
              )}
            </div>
            <Disclosure.Panel className="text-sm p-8 border-gray-300 text-gray-800 bg-gray-50">
              Ran for Duration: {description}
            </Disclosure.Panel>
          </>
        )
      }}
    </Disclosure>
  )
}

export default Simulation
