import {
  T_BackendResponse,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
} from "custom-validator"
import React, { useState, useEffect } from "react"
import DetailsModal from "./modals/DetailsModal"
import DeleteModal from "./modals/DeleteModal"
import useFactories from "../../../../hooks/factories/useFactories"
import TimerTracker from "./TimerTracker"
import useTimersByLocation from "../../../../hooks/timers/useTimersByLocation"
import Timer from "./Timer"

function TimerCards({
  machineClass,
  locationId,
}: {
  machineClass: T_MachineClass
  locationId: string
}) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedTimerId, setSelectedTimerId] = useState("")

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
          <>
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
                      <Timer
                        timer={timer}
                        machineClass={machineClass}
                        isLoading={isTimersByLocationLoading}
                        setSelectedTimerId={setSelectedTimerId}
                        setOpenDeleteModal={setOpenDeleteModal}
                        setOpenDetailsModal={setOpenDetailsModal}
                        machine={timer?.machine as T_Machine}
                      />
                    ) : null
                  )
                )}
              </div>
            </div>
            <TimerTracker />
          </>
        ) : isTimersByLocationLoading ? (
          <>
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
            <div>
              <div className="animate-pulse flex space-x-4 mt-7">
                <div className="h-8 w-[24rem] bg-slate-200 rounded"></div>
              </div>
              <div className="animate-pulse flex space-x-4 mt-7">
                <div className="h-[25rem] w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 mt-4">
            No timer for{" "}
            <span className="font-semibold">{machineClass.name}</span>
          </p>
        )}
        <DetailsModal
          isOpen={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
          id={selectedTimerId}
        />
        <DeleteModal
          isOpen={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          id={selectedTimerId}
        />
      </div>
      <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
    </>
  )
}

export default TimerCards
