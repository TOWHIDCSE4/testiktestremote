"use client"
import { Disclosure } from "@headlessui/react"
import React from "react"
import { BsClockHistory, BsEye } from "react-icons/bs"

interface Props {
  heading: string
  description: string
  noOfTimers: number
  noOfAlerts: number
}

const Simulation: React.FC<Props> = ({
  heading,
  description,
  noOfAlerts,
  noOfTimers,
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
              <div className="flex items-center justify-end w-96 space-x-2">
                <Disclosure.Button className="text-white bg-gray-600 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center">
                  <BsEye className="w-3 h-3 mr-2" />
                  {open ? "Hide Details" : "Show Details"}
                </Disclosure.Button>
                <button className="text-white bg-gray-600 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center">
                  <BsClockHistory className="w-3 h-3 mr-2" />
                  Re-run Simulation
                </button>
              </div>
            </div>
            <Disclosure.Panel className="text-sm p-8 border-gray-300 text-gray-800 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p>Ran for Duration:</p>
                  <p>{description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p>Number Of Alerts</p>
                  <p>{noOfAlerts}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p>Number Of Timers</p>
                  <p>{noOfTimers}</p>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )
      }}
    </Disclosure>
  )
}

export default Simulation
