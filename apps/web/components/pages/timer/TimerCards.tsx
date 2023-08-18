import {
  T_BackendResponse,
  T_MachineClass,
  T_Part,
  T_Timer,
} from "custom-validator"
import React, { useState, useEffect } from "react"
import DetailsModal from "./modals/DetailsModal"
import DeleteModal from "./modals/DeleteModal"
import useTimersByFactory from "../../../hooks/timers/useTimersByFactory"
import useFactories from "../../../hooks/factories/useFactories"
import TimerTracker from "./TimerTracker"

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function TimerCards({ machineClass }: { machineClass: T_MachineClass }) {
  const [selected, setSelected] = useState("64d4a2632e0f5a9012d33483")
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openDeleteModal, setDeleteModal] = useState(false)
  const [removeTimerId, setRemoveTimerId] = useState("")
  const [partId, setPartId] = useState("")

  const {
    data: timersByFactory,
    isLoading: isTimersLoading,
    setFactoryId,
  } = useTimersByFactory()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()

  useEffect(() => {
    if (selected) {
      setFactoryId(selected)
    }
  }, [selected])

  const openController = () => {
    window.open(
      "http://localhost:3000/production/timer/controller",
      "Timer Controller",
      "location,status,scrollbars,resizable,width=1024, height=800"
    )
  }

  return (
    <>
      <div>
        <div className="md:flex justify-between mt-7">
          {isTimersLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-80 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <h6 className="font-bold text-lg text-gray-800 uppercase">
              {machineClass.name} - Timers
            </h6>
          )}

          {isTimersLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <h6 className="font-bold text-lg text-gray-500">
              {timersByFactory?.items.length} Timers
            </h6>
          )}
        </div>
        <div className="mx-auto">
          <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            {isTimersLoading ? (
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
              timersByFactory?.items?.map((timer: T_Timer) =>
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
                        onChange={(e) => setSelected(e.target.value)}
                        value={timer.partId ? timer.partId : ""}
                        disabled={isTimersLoading}
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
                        className="uppercase text-sm text-white bg-blue-950 p-1 rounded-md"
                        onClick={() => {
                          setOpenDetailsModal(true)
                          setPartId(timer.partId)
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
      {isTimersLoading ? (
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
    </>
  )
}

export default TimerCards
