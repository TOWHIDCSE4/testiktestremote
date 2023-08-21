"use client"
import Image from "next/image"
import LogoGreen from "../../../../assets/logo/logo-green.png"
import LogoRed from "../../../../assets/logo/logo-red.png"
import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid"
import { useState, useEffect } from "react"
import useGetTimerDetails from "../../../../hooks/timers/useGetTimerDetails"
import useUsers from "../../../../hooks/users/useUsers"
import { T_BackendResponse, T_User } from "custom-validator"
import useUpdateTimer from "../../../../hooks/timers/useUpdateTimer"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import ControllerDateTime from "./ControllerDateTime"
import CycleClock from "./CycleClock"
import {
  hourMinuteSecond,
  hourMinuteSecondMilli,
} from "../../../../helpers/timeConverter"
import getPercentage from "../../../../helpers/getPercentage"

const Controller = ({ timerId }: { timerId: string }) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const queryClient = useQueryClient()
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const [stopMenu, setStopMenu] = useState(false)
  const [endMenu, setEndMenu] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLoading, setProgressLoading] = useState(false)
  const [unitsCreated, setUnitsCreated] = useState(0)

  const [isTimerClockRunning, setIsTimerClockRunning] = useState(false)
  const [timerClockInSeconds, setTimerClockInSeconds] = useState(0)
  const [timerClockTimeArray, setTimerClockTimeArray] = useState<
    Array<number | string>
  >([])
  const [timerClockIntervalId, setTimerClockIntervalId] = useState<number>(0)

  const [isCycleClockStarting, setIsCycleClockStarting] = useState(false)
  const [isCycleClockStopping, setIsCycleClockStopping] = useState(false)
  const [isCycleClockRunning, setIsCycleClockRunning] = useState(false)
  const [cycleClockInSeconds, setCycleClockInSeconds] = useState(0)
  const [cycleClockTimeArray, setCycleCockTimeArray] = useState<
    Array<number | string>
  >([])
  const [cycleClockIntervalId, setCycleClockIntervalId] = useState<number>(0)

  useEffect(() => {
    if (cycleClockInSeconds > 0 && progress < 101) {
      const percent = getPercentage(
        cycleClockInSeconds,
        timerDetailData?.item?.partId.time as number
      )
      setProgress(percent)
    }
  }, [cycleClockInSeconds])

  const startProgress = () => {
    setProgressLoading((progressLoading) => !progressLoading)
  }

  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timer", timerId],
        })
        toast.success("Timer has been updated")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  // Timer Clock

  useEffect(() => {
    setTimerClockTimeArray(hourMinuteSecond(timerClockInSeconds))
  }, [timerClockInSeconds])

  const runTimer = () => {
    const interval: any = setInterval(() => {
      setTimerClockInSeconds((previousState: number) => previousState + 1)
    }, 1000)
    setTimerClockIntervalId(interval)
    setIsTimerClockRunning(true)
  }
  const stopTimer = () => {
    clearInterval(timerClockIntervalId)
    clearInterval(cycleClockIntervalId)
    setTimerClockInSeconds(0)
    setCycleClockInSeconds(0)
    setIsCycleClockRunning(false)
    setIsTimerClockRunning(false)
    setProgress(0)
    setUnitsCreated(0)
  }

  // Cycle Clock

  useEffect(() => {
    setCycleCockTimeArray(hourMinuteSecondMilli(cycleClockInSeconds))
  }, [cycleClockInSeconds])

  const runCycle = () => {
    setIsCycleClockStarting(true)
    setTimeout(function () {
      const interval: any = setInterval(() => {
        setCycleClockInSeconds((previousState: number) => previousState + 0.01)
      }, 10)
      setCycleClockIntervalId(interval)
      setIsCycleClockRunning(true)
      if (!isTimerClockRunning) {
        runTimer()
      }
      setIsCycleClockStarting(false)
    }, 3000)
  }
  const stopCycle = () => {
    setIsCycleClockStopping(true)
    setTimeout(function () {
      setCycleClockInSeconds(0)
      setIsCycleClockStopping(false)
      setUnitsCreated(unitsCreated + 1)
      setProgress(0)
    }, 3000)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-dark-blue py-3 md:py-0 px-4 md:px-12 md:h-20 items-center">
        {progress > 100 ? (
          <Image src={LogoRed} alt="Logo" width={200} height={100} />
        ) : (
          <Image src={LogoGreen} alt="Logo" width={200} height={100} />
        )}
        <div className="mt-3 md:mt-0">
          <h2 className="uppercase text-2xl md:text-4xl text-white font-semibold text-center">
            {isTimerDetailDataLoading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="h-7 w-36 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <>{timerDetailData?.item?.locationId.name}</>
            )}
          </h2>
          <h3 className="uppercase text-lg md:text-2xl text-gray-300 leading-none font-medium text-center">
            Controller
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 px-4 md:px-12 mt-7 xl:mb-36">
        <div className="order-last md:order-none mt-6 md:mt-0">
          <h4 className="uppercase font-semibold text-sm text-gray-800 xl:text-lg 2xl:text-3xl">
            Details
          </h4>
          <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
            Factory:{" "}
            <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
              {isTimerDetailDataLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              ) : (
                <>{timerDetailData?.item?.factoryId.name}</>
              )}
            </span>
          </h5>
          <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
            Machine:{" "}
            <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
              {isTimerDetailDataLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              ) : (
                <>{timerDetailData?.item?.machineId.name}</>
              )}
            </span>
          </h5>
          <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
            Part/Product:{" "}
            <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
              {isTimerDetailDataLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              ) : (
                <>{timerDetailData?.item?.partId.name}</>
              )}
            </span>
          </h5>
          <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
            Average Time:{" "}
            <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
              {isTimerDetailDataLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              ) : (
                <>{timerDetailData?.item?.partId.time} seconds</>
              )}
            </span>
          </h5>
          <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
            Weight:{" "}
            <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
              {isTimerDetailDataLoading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                </div>
              ) : (
                <>{timerDetailData?.item?.partId.pounds} lbs</>
              )}
            </span>
          </h5>
          <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 xl:text-lg 2xl:text-3xl">
            Operator
          </h4>
          <select
            id="user"
            name="user"
            disabled={
              isTimerDetailDataLoading || isUsersLoading || isUpdateTimerLoading
            }
            className="block mt-2 md:w-60 xl:w-80 2xl:w-[420px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
            defaultValue="Select User"
            required
            onChange={(e) => {
              if (e.target.value !== timerDetailData?.item?.operator) {
                mutate(
                  { ...timerDetailData?.item, operator: e.target.value },
                  callBackReq
                )
              }
            }}
            value={timerDetailData?.item?.operator}
          >
            <option value="">Select User</option>
            {users?.items.map((item: T_User, index: number) => {
              return (
                <option key={index} value={item._id as string}>
                  {item.firstName} {item.lastName}
                </option>
              )
            })}
          </select>
          <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 xl:text-lg 2xl:text-3xl">
            Job
          </h4>
          <select
            id="machine-part"
            name="machine-part"
            className={`block mt-2 w-full md:w-60 xl:w-80 2xl:w-[420px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm xl:text-lg 2xl:text-3xl sm:leading-6`}
          >
            <option>STOCK (SEGUIN) 30 TON MACHINE</option>
            <option>DC STOCK</option>
            <option>DC STOCK</option>
          </select>
          <div className="relative flex">
            <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 xl:text-lg 2xl:text-3xl">
              Readings
            </h4>
            <div className="absolute w-60 xl:w-[234px] 2xl:w-[272px] h-[1px] mt-[25px] xl:mt-[32px] 2xl:mt-[51px] ml-20 xl:ml-[87px] 2xl:ml-[145px] bg-gray-400"></div>
          </div>
          <div className="bg-gray-100 h-16 2xl:h-32 mt-2 w-[321px] 2xl:w-[417px] p-2 text-gray-600">
            <h6 className="text-xs xl:text-sm 2xl:text-2xl">
              Open the timer controller:
            </h6>
            <div className="text-xs xl:text-sm 2xl:text-2xl">
              ------<span className="font-medium">OPERATIONS</span>------
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <CycleClock
            timerClockTimeArray={timerClockTimeArray}
            cycleClockTimeArray={cycleClockTimeArray}
            isCycleClockRunning={isCycleClockRunning}
            isCycleClockStarting={isCycleClockStarting}
            isCycleClockStopping={isCycleClockStopping}
            runCycle={runCycle}
            stopCycle={stopCycle}
            progress={progress}
          />
          {/* Small screen show timer data */}
          <div className="md:hidden mt-8">
            <h6 className="text-center uppercase text-lg text-gray-500 font-semibold leading-none">
              Units Created
            </h6>
            <h1 className="text-[65px] font-semibold text-gray-300 leading-none mt-2 text-center">
              000
            </h1>
            <h5 className="uppercase text-sm font-medium text-gray-800 mt-4 md:text-right">
              Units Per Hour:{" "}
              <span className="uppercase text-sm font-semibold text-gray-500">
                0.000
              </span>
            </h5>
            <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-right">
              Tons Per Hour:{" "}
              <span className="uppercase text-sm font-semibold text-gray-500">
                0.000
              </span>
            </h5>
            <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-right">
              Total Tons:{" "}
              <span className="uppercase text-sm font-semibold text-gray-500">
                0.000
              </span>
            </h5>
          </div>
          {/* Medium - large screen show timer data */}
          <div className="units mt-10 md:mt-28 2xl:mt-56 relative hidden md:block">
            <h6 className="text-right uppercase text-lg xl:text-xl 2xl:text-3xl text-gray-500 font-semibold leading-none">
              Units Created
            </h6>
            <div className="flex absolute md:space-x-8 items-end md:right-0 top-0">
              <div className="-translate-y-1.5 md:-translate-y-2 lg:-translate-y-4">
                <h5 className="uppercase text-sm xl:text-lg 2xl:text-3xl font-medium text-gray-800 mt-2 md:text-right">
                  Units Per Hour:{" "}
                  <span className="uppercase text-sm xl:text-lg 2xl:text-3xl font-semibold text-gray-500">
                    0.000
                  </span>
                </h5>
                <h5 className="uppercase text-sm xl:text-lg 2xl:text-3xl font-medium text-gray-800 mt-2 md:text-right">
                  Tons Per Hour:{" "}
                  <span className="uppercase text-sm xl:text-lg 2xl:text-3xl font-semibold text-gray-500">
                    0.000
                  </span>
                </h5>
                <h5 className="uppercase text-sm xl:text-lg 2xl:text-3xl font-medium text-gray-800 mt-2 md:text-right">
                  Total Tons:{" "}
                  <span className="uppercase text-sm xl:text-lg 2xl:text-3xl font-semibold text-gray-500">
                    0.000
                  </span>
                </h5>
              </div>
              <h1 className="text-[65px] lg:text-[120px] xl:text-[150px] 2xl:text-[180px] font-semibold text-gray-300 leading-none mt-2">
                {unitsCreated < 10
                  ? `00${unitsCreated}`
                  : unitsCreated < 100
                  ? `0${unitsCreated}`
                  : unitsCreated}
              </h1>
            </div>
          </div>
        </div>
        {/* End Medium - large screen show timer data */}
      </div>
      <footer className="fixed bg-white w-full bottom-0">
        <div className="progress-bar">
          <div
            className={`${progress > 100 ? "bg-red-600" : "bg-green-500"} h-4`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex px-12 pb-7 pt-3 md:pb-5 md:pt-5 flex-col md:flex-row justify-between items-center">
          <h4 className="uppercase text-blue-950 font-semibold">
            Developed By IEKOMEDIA
          </h4>
          <h4 className="uppercase text-blue-950 font-semibold">
            <ControllerDateTime
              timeZone={
                !isTimerDetailDataLoading
                  ? timerDetailData?.item?.locationId.timeZone
                  : ""
              }
            />
          </h4>
        </div>
      </footer>
      <div className="slides">
        {/* Bottom Slide Menu */}

        <div className="flex justify-center">
          <div
            className={`${
              stopMenu
                ? "translate-y-0"
                : "translate-y-[192px] xl:translate-y-[216px] 2xl:translate-y-[337px]"
            } bg-dark-blue h-62 xl:h-80 2xl:h-96 w-72 xl:w-[500px] 2xl:w-[800px] z-20 fixed bottom-0 rounded-t-md px-4 pb-5 transition transform duration-1000`}
          >
            <div className="flex justify-center items-center mt-1 2xl:mt-3 mb-0 2xl:mb-2">
              {stopMenu ? (
                <ChevronDoubleDownIcon
                  className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
                  onClick={() => setStopMenu(false)}
                />
              ) : (
                <ChevronDoubleUpIcon
                  className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
                  onClick={() => setStopMenu(true)}
                />
              )}
            </div>
            <div className="bg-[#274263] rounded-md mt-1 h-full flex flex-col justify-start items-center">
              <h6 className="text-yellow-200 uppercase xl:text-xl 2xl:text-4xl mt-2 2xl:mt-6">
                Stop
              </h6>
              <div>
                <div className="flex space-x-2 2xl:space-x-4 items-center mt-1 xl:mt-3 2xl:mt-6">
                  <input
                    id="machine-error"
                    aria-describedby="machine-error-description"
                    name="machine-error"
                    type="checkbox"
                    className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="machine-error"
                    className="text-yellow-200 xl:text-xl 2xl:text-4xl"
                  >
                    Machine Error
                  </label>
                </div>
                <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3">
                  <input
                    id="material-low"
                    aria-describedby="material-low-description"
                    name="material-low"
                    type="checkbox"
                    className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="material-low"
                    className="text-yellow-200 xl:text-xl 2xl:text-4xl"
                  >
                    Machine Low
                  </label>
                </div>
                <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3">
                  <input
                    id="worker-break"
                    aria-describedby="worker-break-description"
                    name="worker-break"
                    type="checkbox"
                    className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="worker-break"
                    className="text-yellow-200 xl:text-xl 2xl:text-4xl"
                  >
                    Worker Break
                  </label>
                </div>
                <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3">
                  <input
                    id="maintenance"
                    aria-describedby="maintenance-description"
                    name="maintenance"
                    type="checkbox"
                    className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="maintenance"
                    className="text-yellow-200 xl:text-xl 2xl:text-4xl"
                  >
                    Maintenance
                  </label>
                </div>
                <div className="flex space-x-2 2xl:space-x-4 items-center xl:mt-2 2xl:mt-3 mb-4">
                  <input
                    id="change-part"
                    aria-describedby="change-part-description"
                    name="change-part"
                    type="checkbox"
                    className="h-4 w-4 2xl:h-6 2xl:w-6 rounded border-gray-300 text-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="change-part"
                    className="text-yellow-200 xl:text-xl 2xl:text-4xl"
                  >
                    Change Part
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side Slide Menu */}
        <div
          className={`${
            endMenu
              ? "translate-x-0"
              : "translate-x-[202px] 2xl:translate-x-[345px]"
          } min-h-screen fixed z-20 top-0 right-0 whitespace-nowrap flex items-end pb-24 transition transform duration-1000`}
        >
          <div className="bg-dark-blue w-56 2xl:w-96 rounded-tl-md rounded-bl-md h-12 xl:h-16 2xl:h-20">
            <div className="flex items-center h-full ml-1 2xl:ml-2">
              {endMenu ? (
                <ChevronDoubleRightIcon
                  className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
                  onClick={() => setEndMenu(false)}
                />
              ) : (
                <ChevronDoubleLeftIcon
                  className="text-green-500 h-4 w-4 2xl:h-8 2xl:w-8 cursor-pointer"
                  onClick={() => setEndMenu(true)}
                />
              )}

              <button
                type="button"
                className="bg-[#274263] xl:text-xl 2xl:text-4xl rounded-md ml-1 2xl:ml-3 text-yellow-200 uppercase w-full py-2 text-center"
                onClick={() => stopTimer()}
              >
                End Production
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controller
