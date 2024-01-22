import {
  T_BackendResponse,
  T_Location,
  T_Machine,
  T_MachineClass,
  T_Timer,
} from "custom-validator"
import { ChangeEvent, useEffect, useMemo, useState } from "react"
import Timer from "./Timer"
import TimerTracker from "./TimerTracker"
import DeleteModal from "./modals/DeleteModal"
import DetailsModal from "./modals/DetailsModal"
import useGetOverallTotal from "../../../../hooks/timerLogs/useGetOverallTotal"
import SetAutoTimerModalComponent from "./modals/SetAutoTimerModal"
import useAutoTimers from "../../../../hooks/autoTimer/useAutoTimers"
import useSetAutoTimer from "../../../../hooks/autoTimer/useSetAutoTimer"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

type T_TimerByMachineClass = {
  id: string
  name: string
  count: number
  timers: T_Timer[]
  machineClasses: T_MachineClass[]
}

function TimerCards({
  timerByMachineClass,
  isLoading,
  locationId,
  locationName,
}: {
  timerByMachineClass: T_TimerByMachineClass
  isLoading: boolean
  locationId: string
  locationName: string
}) {
  const queryClient = useQueryClient()
  const { data: autoTimers, isLoading: isAutoTimersLoading } = useAutoTimers()
  const { mutate: setAutoTimer } = useSetAutoTimer()
  const autoTimer = useMemo(() => {
    const machineClassId = timerByMachineClass.machineClasses[0]._id
    const tmp = autoTimers?.items?.find(
      (item) =>
        item.locationId == locationId && item.machineClassId == machineClassId
    )
    return tmp
  }, [autoTimers, locationId, timerByMachineClass.machineClasses])

  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [selectedTimerId, setSelectedTimerId] = useState("")
  const { data: totalTons } = useGetOverallTotal({
    locationId: locationId as string,
    machineClassId: timerByMachineClass.id,
  })

  const [isAutoTimerOn, setIsAutoTimerOn] = useState<boolean>(false)
  useEffect(() => {
    if (autoTimer) {
      setIsAutoTimerOn(autoTimer.isActive)
    }
  }, [autoTimer])

  const [isOpenSetAutoTimerModal, setIsOpenSetAutoTimerModal] =
    useState<boolean>(false)

  const handleIsAutoTimerOn = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsOpenSetAutoTimerModal(true)
    } else {
      if (autoTimer) {
        setAutoTimer(
          { ...autoTimer, isActive: e.target.checked },
          {
            onSuccess: (data: T_BackendResponse) => {
              queryClient.invalidateQueries({
                queryKey: ["auto-timers"],
              })
              if (data.error) {
                toast.error(String(data.message))
              }
            },
            onError: (err: any) => {
              queryClient.invalidateQueries({
                queryKey: ["auto-timers"],
              })
              toast.error(String(err))
            },
          }
        )
      } else {
        setIsAutoTimerOn(e.target.checked)
      }
    }
  }

  return (
    <>
      <div>
        <div className="justify-between md:flex mt-7">
          {isLoading ? (
            <div className="flex space-x-4 animate-pulse">
              <div className="h-8 rounded w-80 bg-slate-200"></div>
            </div>
          ) : (
            <h6 className="text-lg font-bold text-gray-800 uppercase">
              {timerByMachineClass.name} - Timers
            </h6>
          )}
          {isAutoTimersLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="font-bold uppercase">Auto Timer</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isAutoTimerOn}
                  onChange={handleIsAutoTimerOn}
                />
                <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[0px] after:start-[0px] after:border-gray-600 border border-gray-600 active:outline-none after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 after:bg-gray-300 peer-checked:after:bg-green-600"></div>
              </label>
              <button
                className="font-bold uppercase disabled:opacity-50"
                disabled={!isAutoTimerOn}
                onClick={() => {
                  setIsOpenSetAutoTimerModal(true)
                }}
              >
                {autoTimer ? (
                  <span>
                    {autoTimer.timeH} : {autoTimer.timeM}{" "}
                    {autoTimer.isPM ? "PM" : "AM"}
                  </span>
                ) : (
                  <>NULL</>
                )}
              </button>
            </div>
          )}
          {isLoading ? (
            <div className="flex space-x-4 animate-pulse">
              <div className="w-24 h-8 rounded bg-slate-200"></div>
            </div>
          ) : (
            <h6 className="text-lg font-bold text-gray-500">
              {timerByMachineClass.count}{" "}
              {timerByMachineClass.count > 1 ? "Timers" : "Timer"}
            </h6>
          )}
        </div>
        {isLoading ? (
          <></>
        ) : (
          <div className={"flex gap-4"}>
            {timerByMachineClass.machineClasses.map((item) => (
              <div key={item._id} className="flex flex-col min-w-[12rem]">
                <div className="flex flex-1 gap-2">
                  <div>
                    {item.name == "Radial Press" ? "RP" : item.name} Units:
                  </div>
                  <div>
                    {item.name == "Radial Press"
                      ? totalTons?.item.RPunits
                      : totalTons?.item.units}
                  </div>
                </div>
                <div className="flex flex-1 gap-2">
                  <div>
                    {item.name == "Radial Press" ? "RP" : item.name} Tons:
                  </div>
                  <div>
                    {item.name == "Radial Press"
                      ? totalTons?.item?.RPtons?.toFixed(3)
                      : totalTons?.item?.tons?.toFixed(3)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {timerByMachineClass.timers.length > 0 ? (
          <>
            <div className="mx-auto">
              <div
                className={`${
                  timerByMachineClass.timers.length < 2
                    ? "mt-7 flex flex-nowrap gap-3 justify-center"
                    : `mt-7 grid grid-cols-1 gap-x-10 ml-3 gap-y-10 me-2 sm:grid-cols-2 xl-grid-cols-xl:gap-x-15 xl:grid-cols-${
                        timerByMachineClass.timers.length < 3 ? 2 : 3
                      }  place-items-center`
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="flex space-x-4 animate-pulse">
                      <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
                    </div>

                    <div className="flex space-x-4 animate-pulse">
                      <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
                    </div>

                    <div className="flex space-x-4 animate-pulse">
                      <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
                    </div>
                  </>
                ) : (
                  timerByMachineClass.timers?.map((timer: T_Timer) => (
                    <Timer
                      key={timer._id}
                      timer={timer}
                      machineClassId={timerByMachineClass.id}
                      isLoading={isLoading}
                      setSelectedTimerId={setSelectedTimerId}
                      setOpenDeleteModal={setOpenDeleteModal}
                      setOpenDetailsModal={setOpenDetailsModal}
                      machine={timer?.machine as T_Machine}
                    />
                  ))
                )}
              </div>
            </div>
            <h6 className="text-lg font-bold text-gray-800 uppercase mt-7">
              Timer Tracker - {timerByMachineClass.name}
            </h6>
            <TimerTracker
              locationId={locationId}
              timers={timerByMachineClass.timers}
              machineClassId={timerByMachineClass.id as string}
            />
          </>
        ) : isLoading ? (
          <>
            <div className="grid grid-cols-1 mt-7 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
              <div className="flex space-x-4 animate-pulse">
                <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
              </div>

              <div className="flex space-x-4 animate-pulse">
                <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
              </div>

              <div className="flex space-x-4 animate-pulse">
                <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div>
              <div className="flex space-x-4 animate-pulse mt-7">
                <div className="h-8 w-[24rem] bg-slate-200 rounded"></div>
              </div>
              <div className="flex space-x-4 animate-pulse mt-7">
                <div className="h-[25rem] w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-gray-500">
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
      <SetAutoTimerModalComponent
        isOpen={isOpenSetAutoTimerModal}
        onClose={() => {
          setIsOpenSetAutoTimerModal(false)
        }}
        locationId={locationId}
        locationName={locationName}
        machineClass={timerByMachineClass.machineClasses[0]}
        item={autoTimer}
      />
    </>
  )
}

export default TimerCards
