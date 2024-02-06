"use client"
import { Disclosure } from "@headlessui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import Cookies from "js-cookie"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { BsClockHistory, BsEye } from "react-icons/bs"
import { API_URL } from "../../../../../helpers/constants"

interface Props {
  heading: string
  description: string
  noOfTimers: number
  noOfAlerts: number
  sessionId: string
  startedAt: string
  endAt: string
  date: Date
  cycleMargin: Array<number>
  activeTimersRange: Array<{ start: Date; end: Date } | undefined>
}

const Simulation: React.FC<Props> = ({
  activeTimersRange,
  description,
  cycleMargin,
  noOfAlerts,
  noOfTimers,
  sessionId,
  startedAt,
  heading,
  endAt,
  date,
}) => {
  const queryClient = useQueryClient()
  const timestamp = parseInt(endAt, 10) // Parse the string to an integer
  const pathname = usePathname()
  const router = useRouter()
  const reRunSession = useMutation({
    mutationFn: async (data: { sessionId: string }) => {
      const token = Cookies.get("tfl")
      const res = await fetch(`${API_URL}/api/dev-ops/restart-simulation`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["devOps-timers-by-user"])
      queryClient.invalidateQueries(["devOps-machine-classes"])
      queryClient.invalidateQueries(["devOps-alert-list"])
      queryClient.invalidateQueries(["devOps-sessions"])
    },
  })

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
                <button
                  onClick={() => {
                    reRunSession.mutate({ sessionId: sessionId })
                  }}
                  disabled={reRunSession.isLoading}
                  className="text-white bg-gray-600 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-xs px-3 py-1.5  text-center inline-flex items-center disabled:opacity-50"
                >
                  <BsClockHistory className="w-3 h-3 mr-2" />
                  {reRunSession.isLoading
                    ? "Running Simulation ..."
                    : "Re-run Simulation"}
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
                  <p>Number Of Alerts:</p>
                  <p>{noOfAlerts}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p>Number Of Timers:</p>
                  <p>{noOfTimers}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p>Ran on:</p>
                  <p>{dayjs(date).format("dddd YYYY-MM-DD")}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p>Started At:</p>
                  <p>{dayjs(new Date(startedAt)).format("YYYY-MM-DD HH:mm")}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p>Ended At:</p>
                  <p>{dayjs(new Date(timestamp)).format("YYYY-MM-DD HH:mm")}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <p>Cycle Margin:</p>
                  <p>{cycleMargin.join("-") + " sec"}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p>Most Active Timers Duration:</p>
                  <p>
                    {dayjs(activeTimersRange[0]?.start).format("HH:mm:ss") +
                      " - " +
                      dayjs(activeTimersRange[0]?.end).format("HH:mm:ss")}
                  </p>
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
