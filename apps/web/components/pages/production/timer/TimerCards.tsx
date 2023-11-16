import { T_Machine, T_Timer, T_User } from "custom-validator"
import React, { useState, useEffect } from "react"
import DetailsModal from "./modals/DetailsModal"
import DeleteModal from "./modals/DeleteModal"
import TimerTracker from "./TimerTracker"
import Timer from "./Timer"

type T_TimerByMachineClass = {
  id: string
  name: string
  count: number
  timers: T_Timer[]
}

function TimerCards({
  timerByMachineClass,
  isLoading,
  locationId,
}: {
  timerByMachineClass: T_TimerByMachineClass
  isLoading: boolean
  locationId: string
}) {
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedTimerId, setSelectedTimerId] = useState("")

  return (
    <>
      <div>
        <div className="md:flex justify-between mt-7">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-80 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <h6 className="font-bold text-lg text-gray-800 uppercase">
              {timerByMachineClass.name} - Timers
            </h6>
          )}

          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <h6 className="font-bold text-lg text-gray-500">
              {timerByMachineClass.count}{" "}
              {timerByMachineClass.count > 1 ? "Timers" : "Timer"}
            </h6>
          )}
        </div>
        {timerByMachineClass.timers.length > 0 ? (
          <>
            <div className="mx-auto">
              <div
                className={`${
                  timerByMachineClass.timers.length < 2
                    ? "mt-7 flex flex-nowrap gap-3 justify-center"
                    : `mt-7 grid grid-cols-1 gap-x-10 ml-2 gap-y-10 me-2 sm:grid-cols-2 md:gap-x-19 xl-grid-cols-xl:gap-x-15 xl:grid-cols-${
                        timerByMachineClass.timers.length < 3 ? 2 : 3
                      }  place-items-center`
                }`}
              >
                {isLoading ? (
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
                  timerByMachineClass.timers?.map((timer: T_Timer, index) => (
                    <Timer
                      key={index}
                      timer={timer}
                      machineClassId={timerByMachineClass.id}
                      isLoading={isLoading}
                      setSelectedTimerId={setSelectedTimerId}
                      setOpenDeleteModal={setOpenDeleteModal}
                      setOpenDetailsModal={setOpenDetailsModal}
                      machine={timer?.machine as T_Machine}
                      operator={
                        timer?.assignedOperator
                          ? (timer?.assignedOperator as T_User)
                          : (timer.operatorName as string)
                      }
                    />
                  ))
                )}
              </div>
            </div>
            <h6 className="font-bold text-lg text-gray-800 uppercase mt-7">
              Timer Tracker - {timerByMachineClass.name}
            </h6>
            <TimerTracker
              locationId={locationId}
              machineClassId={timerByMachineClass.id as string}
            />
          </>
        ) : isLoading ? (
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
            No timers available{" "}
            <span className="font-semibold">{timerByMachineClass.name}</span>
          </p>
        )}
        {openDetailsModal && (
          <DetailsModal
            isOpen={openDetailsModal}
            onClose={() => setOpenDetailsModal(false)}
            id={selectedTimerId}
          />
        )}
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
