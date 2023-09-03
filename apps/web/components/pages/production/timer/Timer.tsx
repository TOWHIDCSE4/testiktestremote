import {
  T_BackendResponse,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
  T_User,
} from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"
import useUpdateTimer from "../../../../hooks/timers/useUpdateTimer"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import DropDownMenu from "./DropDownMenu"
import useTotalTonsUnit from "../../../../hooks/timers/useTotalTonsUnit"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import useGetCycleTimerRealTime from "../../../../hooks/timers/useGetCycleTimerRealTime"
import { hourMinuteSecond } from "../../../../helpers/timeConverter"

type T_Props = {
  timer: T_Timer
  machineClassId: string
  isLoading: boolean
  setSelectedTimerId: Dispatch<string>
  setOpenDetailsModal: Dispatch<boolean>
  setOpenDeleteModal: Dispatch<boolean>
  machine: T_Machine
  operator: T_User
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
  const { data: totalTonsUnit, isLoading: isTotalTonsUnitCreated } =
    useTotalTonsUnit({
      locationId: timer.locationId as string,
      timerId: timer._id as string,
    })
  const { data: cycleTimer, isLoading: isCycleTimerLoading } =
    useGetCycleTimerRealTime(timer._id as string)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])
  const [cycleClockIntervalId, setCycleClockIntervalId] = useState<number>(0)
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
    window.open(
      `/production/timer/controller/${timer._id}`,
      "Timer Controller",
      "location,status,scrollbars,resizable,width=1024, height=800"
    )
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
    const interval: any = setInterval(() => {
      setCycleClockInSeconds((previousState: number) => previousState + 1)
    }, 1000)
    setCycleClockIntervalId(interval)
  }
  useEffect(() => {
    setCycleCockTimeArray(hourMinuteSecond(cycleClockInSeconds))
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
      clearInterval(cycleClockIntervalId)
      setIsCycleClockRunning(false)
    }
  }, [cycleTimer])

  return (
    <div
      key={timer._id as string}
      className="bg-white rounded-md border border-gray-200 drop-shadow-lg"
    >
      <div className="px-4 py-4 border-b border-gray-200 flex items-center gap-2">
        <select
          id="part"
          name="part"
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
          defaultValue={
            typeof timer.partId === "string" && timer.partId ? timer.partId : ""
          }
          disabled={isLoading || isUpdateTimerLoading}
          onChange={(e) => {
            if (e.target.value !== timer.partId) {
              mutate({ ...timer, partId: e.target.value }, callBackReq)
            }
          }}
        >
          <option value={""} disabled>
            Select Part
          </option>
          {timer?.parts?.map((item: T_Part, index: number) => {
            if (item.machineClassId === machineClassId) {
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
      <div className="px-4 py-4 text-center space-y-2">
        <h3 className="text-gray-700 font-bold uppercase text-xl">
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
          <h2 className="font-bold text-stone-400 text-5xl">00:00:00</h2>
        )}
        <p className="text-amber-600">
          {operator
            ? `${operator?.firstName} ${operator?.lastName}`
            : "Please select operator"}
        </p>
        <div>
          <h2 className="font-semibold text-gray-400 text-3xl">
            {totalTonsUnit?.item.dailyUnits
              ? addZeroFront(totalTonsUnit?.item.dailyUnits)
              : "000"}
          </h2>
          <h6 className="text-gray-700 font-semibold uppercase text-sm">
            Daily Units
          </h6>
        </div>
      </div>
      <div className="px-4">
        <div className="flex justify-between text-gray-900">
          <span>Total Tons:</span>
          <span>
            {totalTonsUnit?.item.tons ? totalTonsUnit?.item.tons : "0.000"}
          </span>
        </div>
        <div className="flex justify-between text-gray-900">
          <span>Average Ton/hr:</span>
          <span>
            {totalTonsUnit?.item.tons
              ? totalTonsUnit?.item.tonsPerHour
              : "0.000"}
          </span>
        </div>
        <div className="flex justify-between text-gray-900">
          <span>Average Unit/hr:</span>
          <span>
            {totalTonsUnit?.item.tons
              ? totalTonsUnit?.item.unitPerHour
              : "0.000"}
          </span>
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
      </div>
    </div>
  )
}

export default Timer
