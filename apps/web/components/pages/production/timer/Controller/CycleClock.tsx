import { T_ControllerTimer } from "custom-validator"
import React, { Dispatch, useEffect, useState } from "react"
import { hourMinuteSecondMilli } from "../../../../../helpers/timeConverter"

type T_Props = {
  timerClockTimeArray: Array<number | string>
  cycleClockTimeArray: Array<number | string>
  isCycleClockRunning: boolean
  isCycleClockStopping: boolean
  isCycleClockStarting: boolean
  runCycle: Function
  stopCycle: Function
  progress: number
  isAbleToStart: boolean
  isEndAddCycleTimerLoading?: boolean
  isEndCycleTimerLoading?: boolean
}

const CycleClock = ({
  timerClockTimeArray,
  cycleClockTimeArray,
  isCycleClockRunning,
  isCycleClockStarting,
  isCycleClockStopping,
  runCycle,
  stopCycle,
  progress,
  isAbleToStart,
  isEndAddCycleTimerLoading,
  isEndCycleTimerLoading,
}: T_Props) => {
  const isActive = () => {
    if (
      isCycleClockRunning !== true &&
      isEndCycleTimerLoading &&
      isEndAddCycleTimerLoading !== true
    ) {
      return true
    } else if (
      isCycleClockRunning !== true &&
      isEndCycleTimerLoading !== true &&
      isEndAddCycleTimerLoading !== true
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className="timer  dark:bg-dark-blue dark:text-white">
      <div className="flex items-center gap-2 justify-end  dark:bg-dark-blue dark:text-white">
        <h6 className="text-center md:text-right uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold  dark:bg-dark-blue dark:text-white">
          Time:
        </h6>
        <div className="flex justify-center items-center  dark:bg-dark-blue dark:text-white xl:space-x-0 2xl:space-x-1 md:space-x-2 lg:space-x-1">
          <h6 className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] md:[30px] xl:w-[28px] 2xl:w-[37px] dark:text-white">
            {timerClockTimeArray[0]}
          </h6>
          <span className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[8px] md:[30px] xl:w-[10px] dark:bg-dark-blue dark:text-white ">
            :
          </span>
          <h6 className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] md:[30px] xl:w-[28px] 2xl:w-[37px]  dark:bg-dark-blue dark:text-white">
            {timerClockTimeArray[1]}
          </h6>
          <span className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[8px] md:[30px] xl:w-[10px]  dark:bg-dark-blue dark:text-white">
            :
          </span>
          <h6 className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] md:[30px] xl:w-[28px] 2xl:w-[37px]  dark:bg-dark-blue dark:text-white">
            {timerClockTimeArray[2]}
          </h6>
        </div>
      </div>
      <div className="md:float-right mt-2  dark:bg-dark-blue dark:text-white">
        <div className="text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl">
          <div
            className={`countdown-container w-full ipadair:w-[385px] lg:w-[610px] xl:w-[680px] 2xl:w-[800px] rounded-md border-2 border-b-4 border-stone-500 border-b-green-500  bg-[#f1f2e1] pt-2 pb-3.5  ${
              progress > 100
                ? "border-red-500"
                : isCycleClockRunning
                ? "border-green-500"
                : "border-stone-500"
            }`}
          >
            {isCycleClockRunning ? (
              <div className="flex items-center justify-center ipadair:space-x-0 lg:space-x-0 xl:space-x-1 2xl:space-x-0 ipadair:mr-0 lg:mr-0 xl:mr-2 2xl:mr-0">
                <h2
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-10 md:w-[75px] lg:w-[130px] xl:w-[140px] 2xl:w-[180px] ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  {cycleClockTimeArray[0]}
                </h2>
                <span
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  :
                </span>
                <h2
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-14 md:w-[80px] lg:w-[130px] xl:w-[140px] 2xl:w-[180px] ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  {cycleClockTimeArray[1]}
                </h2>
                <span
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  :
                </span>
                <h2
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-14 md:w-[80px] lg:w-[130px] xl:w-[140px] 2xl:w-[180px] ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  {cycleClockTimeArray[2]}
                </h2>
                <span
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  :
                </span>
                <h2
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-14 md:w-[80px] lg:w-[130px] xl:w-[140px] 2xl:w-[180px] ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  {cycleClockTimeArray[3]}
                </h2>
              </div>
            ) : (
              <div className="flex items-center justify-center ipadair:space-x-0 lg:space-x-0 xl:space-x-1 2xl:space-x-0 ipadair:mr-0 lg:mr-0 xl:mr-2 2xl:mr-0">
                <h2
                  className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                    !isCycleClockRunning ? "text-stone-300" : "text-dark-blue"
                  }`}
                >
                  00:00:00:00
                </h2>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            {isActive() ? (
              <button
                type="button"
                className={`text-3xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
                  isCycleClockStarting
                    ? "scale-75 transition-transform duration-300 text-green-200 cursor-not-allowed"
                    : "text-green-600 cursor-pointer"
                } ${isAbleToStart ? "" : "text-custom-color cursor-pointer"}`}
                onClick={() => isCycleClockStarting !== true && runCycle()}
              >
                Start
              </button>
            ) : (
              <button
                type="button"
                className={`text-3xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
                  isCycleClockStopping
                    ? "scale-75 transition-transform duration-300 text-neutral-200 cursor-not-allowed"
                    : "text-neutral-600 cursor-pointer"
                }`}
                onClick={() => isCycleClockStarting !== true && stopCycle()}
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CycleClock
