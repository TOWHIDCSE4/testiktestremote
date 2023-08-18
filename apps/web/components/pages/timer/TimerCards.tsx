import {
  T_BackendResponse,
  T_MachineClass,
  T_Part,
  T_Timer,
} from "custom-validator"
import React, { useState, useEffect } from "react"
import DetailsModal from "./modals/DetailsModal"
import DeleteModal from "./modals/DeleteModal"
import useFactories from "../../../hooks/factories/useFactories"
import TimerTracker from "./TimerTracker"
import useTimersByLocation from "../../../hooks/timers/useTimersByLocation"

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function TimerCards({
  machineClass,
  locationId,
}: {
  machineClass: T_MachineClass
  locationId: string
}) {
  const [selected, setSelected] = useState("")
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openDeleteModal, setDeleteModal] = useState(false)
  const [removeTimerId, setRemoveTimerId] = useState("")
  const [partId, setPartId] = useState("")

  const {
    data: timersByLocation,
    isLoading: isTimersByLocationLoading,
    setLocationId,
  } = useTimersByLocation()

  useEffect(() => {
    if (locationId) {
      setLocationId(locationId)
    }
  }, [locationId])

  const openController = () => {
    window.open(
      "http://localhost:3000/production/timer/controller",
      "Timer Controller",
      "location,status,scrollbars,resizable,width=1024, height=800"
    )
  }

  const timerByMachineClassCount = (machineClassId: string) => {
    const timerByMachineClass =
      timersByLocation?.items?.filter((timer: T_Timer) => {
        if (timer.machineClassId === machineClassId) {
          return timer
        }
      }) || []
    return timerByMachineClass
  }

  return (
    <>
      <div>
        <div className="md:flex justify-between mt-7">
          {isTimersByLocationLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-80 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <h6 className="font-bold text-lg text-gray-800 uppercase">
              {machineClass.name} - Timers
            </h6>
          )}

          {isTimersByLocationLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <h6 className="font-bold text-lg text-gray-500">
              {timerByMachineClassCount(machineClass._id as string).length > 0
                ? timerByMachineClassCount(machineClass._id as string).length +
                  " " +
                  (timerByMachineClassCount(machineClass._id as string).length >
                  1
                    ? "Timers"
                    : "Timer")
                : null}
            </h6>
          )}
        </div>
        {timerByMachineClassCount(machineClass._id as string).length > 0 ? (
          <div className="mx-auto">
            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
              {isTimersByLocationLoading ? (
                <>
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
                  </div>

                  <div className="animate-pulse flex space-x-4">
                    <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
                  </div>

                  <div className="animate-pulse flex space-x-4">
                    <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
                  </div>
                </>
              ) : (
                timersByLocation?.items?.map((timer: T_Timer) =>
                  timer.machineClassId === machineClass._id ? (
                    <div
                      key={timer._id as string}
                      className="bg-white rounded-md border border-gray-200 drop-shadow-lg"
                    >
                      <div className="px-4 py-4 border-b border-gray-200">
                        <select
                          id="part"
                          name="part"
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
                          onChange={(e) => setPartId(e.target.value)}
                          defaultValue={timer.partId ? timer.partId : ""}
                          disabled={isTimersByLocationLoading}
                        >
                          <option value={""} disabled>
                            Select Part
                          </option>
                          {timer?.parts.map((item: T_Part, index: number) => {
                            if (item.machineClassId === machineClass._id) {
                              return (
                                <option key={index} value={item._id as string}>
                                  {item.name}
                                </option>
                              )
                            } else {
                              return null
                            }
                          })}
                        </select>
                      </div>
                      <div className="px-4 py-4 text-center space-y-2">
                        <h3 className="text-gray-700 font-bold uppercase text-xl">
                          RP 1225
                        </h3>
                        <h1 className="font-bold text-stone-400 text-5xl">
                          00:00:00
                        </h1>
                        <p className="text-amber-600">Please set Operator</p>
                        <div>
                          <h2 className="font-semibold text-gray-400 text-3xl">
                            000
                          </h2>
                          <h6 className="text-gray-700 font-semibold uppercase text-sm">
                            Daily Units
                          </h6>
                        </div>
                      </div>
                      <div className="px-4">
                        <div className="flex justify-between text-gray-900">
                          <span>Total Tons:</span>
                          <span>0.000</span>
                        </div>
                        <div className="flex justify-between text-gray-900">
                          <span>Average Ton/hr:</span>
                          <span>0.000</span>
                        </div>
                        <div className="flex justify-between text-gray-900">
                          <span>Average Unit/hr:</span>
                          <span>0.000</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-5 gap-y-3 px-4 my-4">
                        <button
                          className="uppercase text-sm text-white bg-green-800 p-1 rounded-md"
                          onClick={openController}
                        >
                          Controller
                        </button>
                        <button
                          className="uppercase text-sm text-white bg-stone-300 p-1 rounded-md"
                          onClick={() => alert("Coming soon...")}
                        >
                          Live Camera
                        </button>
                        <button
                          className="uppercase disabled:opacity:70 text-sm text-white bg-blue-950 p-1 rounded-md"
                          disabled={partId === ""}
                          onClick={() => {
                            setOpenDetailsModal(true)
                          }}
                        >
                          Details
                        </button>
                        <button
                          className="uppercase text-sm text-white bg-red-600 p-1 rounded-md"
                          onClick={() => {
                            setDeleteModal(true)
                            setRemoveTimerId(timer._id as string)
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : null
                )
              )}
            </div>
          </div>
        ) : isTimersByLocationLoading ? (
          <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            <div className="animate-pulse flex space-x-4">
              <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
            </div>

            <div className="animate-pulse flex space-x-4">
              <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
            </div>

            <div className="animate-pulse flex space-x-4">
              <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            No timer with {machineClass.name}.
          </p>
        )}
        <DetailsModal
          isOpen={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
          id={partId}
        />
        <DeleteModal
          isOpen={openDeleteModal}
          onClose={() => setDeleteModal(false)}
          id={removeTimerId}
        />
      </div>
      {isTimersByLocationLoading ? (
        <>
          <div className="animate-pulse flex space-x-4 mt-7">
            <div className="h-8 w-[24rem] bg-slate-200 rounded"></div>
          </div>
          <div className="animate-pulse flex space-x-4 mt-7">
            <div className="h-[25rem] w-full bg-slate-200 rounded"></div>
          </div>
        </>
      ) : (
        <TimerTracker />
      )}
      <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
    </>
  )
}

export default TimerCards
