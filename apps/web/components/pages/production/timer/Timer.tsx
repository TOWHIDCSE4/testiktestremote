import {
  T_BackendResponse,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
  T_User,
} from "custom-validator"
import React, { Dispatch, useEffect, useState, useRef } from "react"
import useUpdateTimer from "../../../../hooks/timers/useUpdateTimer"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import DropDownMenu from "./DropDownMenu"
import useTotalTonsUnit from "../../../../hooks/timers/useTotalTonsUnit"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import useGetCycleTimerRealTime from "../../../../hooks/timers/useGetCycleTimerRealTime"
import {
  hourMinuteSecond,
  hourMinuteSecondMilli,
} from "../../../../helpers/timeConverter"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"
import { initializeSocket } from "../../../../helpers/socket"
import { Socket } from "socket.io-client"
import useGetAllTimerLogsCount from "../../../../hooks/timerLogs/useGetAllTimerLogsCount"
import { useSocket } from "../../../../store/useSocket"
import useStoreTimer from "../../../../store/useStoreTimer"
import useGetTimerDetails from "../../../../hooks/timers/useGetTimerDetails"
import { getObjectId } from "../../../../helpers/ids"
import useGetTimerJobs from "../../../../hooks/timers/useGetTimerJobs"
import cn from "classnames"
import useGetControllerTimer from "../../../../hooks/timers/useGetControllerTimer"
import ControllerModal from "../../../shared/ControllerModal"
import { ControllerDetailData } from "./ControllerV2"
import { ControllerContextProvider } from "./ControllerV2/ControllerContext"
import useGetJobTimerByTimerId from "../../../../hooks/jobTimer/useGetJobTimerByTimerId"
import useGetAllTimerLogs from "../../../../hooks/timerLogs/useGetAllTimerLogs"

type T_Props = {
  timer: T_Timer
  machineClassId: string
  isLoading: boolean
  setSelectedTimerId: Dispatch<string>
  setOpenDetailsModal: Dispatch<boolean>
  setOpenDeleteModal: Dispatch<boolean>
  machine: T_Machine
  operator: T_User | string
}

const Timer = ({
  timer,
  machineClassId,
  isLoading,
  setSelectedTimerId,
  setOpenDetailsModal,
  setOpenDeleteModal,
  machine,
  operator,
}: T_Props) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const queryClient = useQueryClient()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const { data: totalTonsUnit } = useTotalTonsUnit({
    locationId: timer.locationId as string,
    timerId: timer._id as string,
  })
  const { isLoading: isTimerLogsLoading } = useGetAllTimerLogs({
    locationId: timer.locationId as string,
    timerId: timer._id as string,
  })
  const { data: timerLogsCount, refetch: refetchTimerLogs } =
    useGetAllTimerLogsCount({
      locationId: timer.locationId as string,
      timerId: timer._id as string,
    })
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(getObjectId(timer._id))
  const { isLoading: isJobTimerLoading } = useGetJobTimerByTimerId({
    locationId: timerDetailData?.item?.locationId._id,
    timerId: getObjectId(timer),
  })
  const { isLoading: isJobsLoading } = useGetTimerJobs(
    getObjectId(timerDetailData?.item?.locationId),
    getObjectId(timerDetailData?.item?.factoryId),
    getObjectId(timerDetailData?.item?.partId)
  )
  const {
    isLoading: isControllerTimerLoading,
    refetch: controllerTimerRefetch,
  } = useGetControllerTimer(getObjectId(timer))
  const { data: cycleTimer, refetch: cycleRefetch } = useGetCycleTimerRealTime(
    timer._id as string
  )
  const [isControllerModalOpen, setIsControllerModalOpen] = useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])
  const [unitCreated, setUnitCreated] = useState(0)
  const [partQuery, setPartQuery] = useState("")
  const [selectedPart, setSelectedPart] = useState({
    id: typeof timer.partId === "string" && timer.partId ? timer.partId : "",
    name: timer?.part ? timer?.part?.name : "",
  })
  const socket = useSocket((store) => store.instance)
  // const { isTimerStop } = useStoreTimer((store) => store)

  const isControllerLoading =
    isJobsLoading ||
    isControllerTimerLoading ||
    isTimerDetailDataLoading ||
    isJobTimerLoading ||
    isTimerLogsLoading
  const controllerDetailData = isTimerDetailDataLoading
    ? {}
    : {
        locationName: timerDetailData?.item?.locationId.name,
        factoryName: timerDetailData?.item?.factoryId.name,
        machineName: timerDetailData?.item?.machineId.name,
        partName: timerDetailData?.item?.partId.name,
        averageTime: timerDetailData?.item?.partId.time,
        weight: timerDetailData?.item?.partId.tons,
      }

  const onControllerStopCycle = (unit: number) => {
    setCycleClockInSeconds(0)
    setCycleCockTimeArray(hourMinuteSecond(0))
    runCycle()
    setUnitCreated(unit)
  }

  const onControllerStopCycleWithReasons = (unit: number) => {
    setCycleClockInSeconds(0)
    setCycleCockTimeArray(hourMinuteSecond(0))
    stopInterval()
    setUnitCreated(unit)
  }

  const onControllerModalClosed = (unit: number, seconds: number) => {
    setCycleClockInSeconds(seconds)
    setCycleCockTimeArray(hourMinuteSecond(seconds))
    setUnitCreated(unit)
    if (seconds > 0 && !isCycleClockRunning) {
      runCycle()
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const runSocket = (data: any) => {
      if (data.action === "add") {
        runCycle()
      }
      if (data.action === "endAndAdd") {
        if (!isControllerModalOpen) {
          queryClient.invalidateQueries([
            "timer-logs",
            timer.locationId,
            getObjectId(timer),
          ])
        }
        setCycleClockInSeconds(0)
        runCycle()
      }
      if (data.action === "end") {
        if (!isControllerModalOpen) {
          queryClient.invalidateQueries([
            "timer-logs",
            timer.locationId,
            getObjectId(timer),
          ])
        }
        setCycleClockInSeconds(0)
        stopInterval()
      }
      if (data.action === "update-cycle" && data.timers.length > 0) {
        if (!isControllerModalOpen && !isCycleClockRunning) {
          runCycle()
        }
        const timeZone = timer?.location?.timeZone
        const timerStart = dayjs.tz(
          dayjs(data.timers[0].createdAt),
          timeZone ? timeZone : ""
        )
        const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
        const secondsLapse = currentDate.diff(timerStart, "seconds", true)
        setCycleClockInSeconds((current: number) => {
          if (secondsLapse > current) {
            return secondsLapse
          }
          return current
        })
      }
      if (data.action === "cycle-tick") {
        if (!isControllerModalOpen && !isCycleClockRunning) {
          runCycle()
        }
        setCycleClockInSeconds((current: number) => {
          if (data.second > current) {
            return data.second
          }
          return current
        })
      }
      if (
        data.action.includes("end-controller") ||
        data.action.includes("end-production")
      ) {
        stopInterval()
        setCycleClockInSeconds(0)
      }
      if (data.action === "stop-press") {
        setCycleClockInSeconds(0)
        runCycle()
        setUnitCreated((current) => {
          if (data.currentUnit > current) {
            return data.currentUnit
          }
          return current
        })
        if (!isControllerModalOpen) {
          queryClient.invalidateQueries([
            "timer-logs",
            timer.locationId,
            timer._id,
          ])
          queryClient.invalidateQueries([
            "timer-logs-count",
            timer.locationId,
            timer._id,
          ])
        }
      }
    }
    socket?.on(`timer-${timer._id}`, runSocket)

    return () => {
      socket?.off(`timer-${timer._id}`, runSocket)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, timer._id])

  const intervalRef = useRef<any>()
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])
  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timers-location"],
        })
        queryClient.invalidateQueries({
          queryKey: ["timer", timer._id],
        })
        toast.success("Timer part has been updated")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }
  const openController = () => {
    setIsControllerModalOpen(true)
  }
  const addZeroFront = (num: number) => {
    let value = null
    if (num < 10) {
      value = `00${num}`
    } else if (num >= 10 && num < 100) {
      value = `0${num}`
    } else {
      value = num
    }
    return value
  }
  const runCycle = () => {
    stopInterval()
    setIsCycleClockRunning(true)
    intervalRef.current = setInterval(() => {
      setCycleClockInSeconds((previousState: number) => previousState + 0.1)
    }, 100)
  }
  useEffect(() => {
    setCycleCockTimeArray(hourMinuteSecondMilli(cycleClockInSeconds))
  }, [cycleClockInSeconds])

  useEffect(() => {
    if (cycleTimer?.items && cycleTimer?.items.length > 0) {
      const timeZone = timer?.location?.timeZone
      const timerStart = dayjs.tz(
        dayjs(cycleTimer?.items[0].createdAt),
        timeZone ? timeZone : ""
      )
      const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
      const secondsLapse = currentDate.diff(timerStart, "seconds", true)
      setCycleClockInSeconds(secondsLapse)
      if (!cycleTimer?.items[0].endAt && !isCycleClockRunning) {
        runCycle()
        setIsCycleClockRunning(true)
      }
    } else {
      setIsCycleClockRunning(false)
    }
  }, [cycleTimer])

  useEffect(() => {
    if (
      timerLogsCount?.item?.count &&
      timerLogsCount?.item?.count > unitCreated
    ) {
      setUnitCreated(timerLogsCount?.item?.count)
    }
  }, [timerLogsCount?.item?.count])

  useEffect(() => {
    if (timer.part) {
      setSelectedPart({
        id:
          typeof timer.partId === "string" && timer.partId ? timer.partId : "",
        name: timer?.part ? timer?.part?.name : "",
      })
    }
  }, [timer])

  const filteredParts =
    partQuery === ""
      ? timer?.parts?.slice(0, 30)
      : timer?.parts
          ?.filter((timer) => {
            return timer.name.toLowerCase().includes(partQuery.toLowerCase())
          })
          ?.slice(0, 30)

  const updateTimerPart = ({ id, name }: { id: string; name: string }) => {
    setSelectedPart({ id, name })
    if (id && id !== timer.partId) {
      const timerCopy = { ...timer }
      // Needed to remove parts because of 413 error
      delete timerCopy.parts
      mutate({ ...timerCopy, partId: id }, callBackReq)
    }
  }

  const stopInterval = () => {
    clearInterval(intervalRef.current)
    setIsCycleClockRunning(false)
  }

  return (
    <>
      <div
        key={timer._id as string}
        className="bg-white rounded-md border border-gray-200 drop-shadow-lg w-[270px] "
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
          <Combobox
            as="div"
            value={selectedPart}
            onChange={updateTimerPart}
            disabled={isCycleClockRunning ? true : isUpdateTimerLoading}
          >
            <div className="relative">
              <Combobox.Input
                className={`w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed`}
                onChange={(event) => setPartQuery(event.target.value)}
                displayValue={(selected: { id: string; name: string }) => {
                  return selected ? selected.name : ""
                }}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                <ChevronUpDownIcon
                  className={`h-5 w-5 ${
                    isUpdateTimerLoading ? "text-gray-400" : "text-gray-600"
                  }`}
                  aria-hidden="true"
                />
              </Combobox.Button>

              {filteredParts && filteredParts.length > 0 ? (
                <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredParts.map((item: T_Part, index: number) => (
                    <Combobox.Option
                      key={index}
                      value={{ id: item._id, name: item.name }}
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white`}
                    >
                      <span className="block">{item.name}</span>
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              ) : null}
            </div>
          </Combobox>
          <DropDownMenu
            setOpenEditModal={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation()
              setOpenDetailsModal(true)
              setSelectedTimerId(timer._id as string)
            }}
            setOpenDeleteModal={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation()
              setOpenDeleteModal(true)
              setSelectedTimerId(timer._id as string)
            }}
          />
        </div>
        <div className="px-4 py-4 space-y-2 text-center">
          <h3 className="text-xl font-bold text-gray-700 uppercase">
            {machine?.name}
          </h3>
          {isCycleClockRunning ? (
            <div className="flex items-center justify-center">
              <h2
                className={`text-center font-bold text-5xl ${
                  !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                }`}
              >
                {cycleClockTimeArray[0]}
              </h2>
              <span
                className={`text-center font-bold text-5xl ${
                  !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center font-bold text-5xl ${
                  !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                }`}
              >
                {cycleClockTimeArray[1]}
              </h2>
              <span
                className={`text-center font-bold text-5xl ${
                  !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center font-bold text-5xl ${
                  !isCycleClockRunning ? "text-stone-400" : "text-stone-800"
                }`}
              >
                {cycleClockTimeArray[2]}
              </h2>
            </div>
          ) : (
            <h2 className="text-5xl font-bold text-stone-400">00:00:00</h2>
          )}
          <p className="text-lg text-amber-600">
            {typeof operator === "object"
              ? `${operator?.firstName} ${operator?.lastName}`
              : typeof operator === "string"
              ? `${operator}`
              : `Operator Unassigned`}
          </p>
          <div>
            <h2 className="text-5xl font-semibold text-gray-400">
              {unitCreated ? addZeroFront(unitCreated) : "000"}
            </h2>
            <h6 className="text-lg font-semibold text-gray-700 uppercase">
              Daily Units
            </h6>
          </div>
        </div>
        <div className="px-4">
          <div className="flex justify-between text-gray-900">
            <span>Total Tons:</span>
            <span>
              {totalTonsUnit?.item?.tons
                ? totalTonsUnit?.item?.tons.toFixed(3)
                : "0.000"}
            </span>
          </div>
          <div className="flex justify-between text-gray-900">
            <span>Average Ton/hr:</span>
            <span>
              {totalTonsUnit?.item?.tonsPerHour
                ? totalTonsUnit?.item?.tonsPerHour.toFixed(3)
                : "0.000"}
            </span>
          </div>
          <div className="flex justify-between text-gray-900">
            <span>Average Unit/hr: </span>
            <span>
              {totalTonsUnit?.item?.unitPerHour
                ? Math.round(totalTonsUnit?.item.unitPerHour)
                : "0"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 px-4 my-4 gap-x-5 gap-y-3">
          <button
            className={cn("uppercase text-sm text-white  p-1 rounded-md", {
              ["bg-stone-300"]: isJobsLoading,
              ["bg-green-800"]: !isJobsLoading,
              ["cursor-not-allowed"]: isJobsLoading,
            })}
            onClick={openController}
            disabled={isControllerLoading}
          >
            {isControllerLoading ? "Loading Controller.." : "Controller"}
          </button>
          <button
            className="p-1 text-sm text-white uppercase rounded-md bg-stone-300"
            onClick={() => alert("Coming soon...")}
          >
            Live Camera
          </button>
        </div>
      </div>
      <ControllerContextProvider
        controllerDetailData={controllerDetailData as ControllerDetailData}
        operator={timerDetailData?.item?.operator}
        timerId={getObjectId(timer)}
        initialCycleClockSeconds={cycleClockInSeconds}
        initialUnitCreated={timerLogsCount?.item?.count as number}
        isControllerModalOpen={isControllerModalOpen}
        onStopCycle={onControllerStopCycle}
        onControllerModalClosed={onControllerModalClosed}
        onStopCycleWithReasons={onControllerStopCycleWithReasons}
        onEndProduction={onControllerStopCycleWithReasons}
      >
        <ControllerModal
          isOpen={isControllerModalOpen}
          onClose={() => setIsControllerModalOpen(false)}
          timerId={timer._id}
        />
      </ControllerContextProvider>
    </>
  )
}
export default Timer
