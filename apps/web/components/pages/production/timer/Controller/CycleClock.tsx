import { T_ControllerTimer } from "custom-validator"
import React, { Dispatch } from "react"

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
}: T_Props) => {
  return (
    <div className="timer">
      <div className="flex items-center gap-2 justify-end">
        <h6 className="text-center md:text-right uppercase text-md md:text-lg xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold">
          Time:
        </h6>
        <div className="flex justify-center items-center">
          <h6 className="text-center uppercase text-md md:text-lg xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] xl:w-[28px] 2xl:w-[37px]">
            {timerClockTimeArray[0]}
          </h6>
          <span className="text-center uppercase text-md md:text-lg xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[8px] xl:w-[10px]">
            :
          </span>
          <h6 className="text-center uppercase text-md md:text-lg xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] xl:w-[28px] 2xl:w-[37px]">
            {timerClockTimeArray[1]}
          </h6>
          <span className="text-center uppercase text-md md:text-lg xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[8px] xl:w-[10px]">
            :
          </span>
          <h6 className="text-center uppercase text-md md:text-lg xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] xl:w-[28px] 2xl:w-[37px]">
            {timerClockTimeArray[2]}
          </h6>
        </div>
      </div>
      <div className="md:float-right mt-2">
        <div className="">
          <div
            className={`countdown-container w-full md:w-[370px] lg:w-[430px] xl:w-[700px] 2xl:w-[950px] rounded-md border-2 border-b-4 border-stone-500 border-b-green-500  bg-[#f1f2e1] pt-2 pb-3.5 px-5  ${
              progress > 100
                ? "border-red-500"
                : isCycleClockRunning || isCycleClockStopping
                ? "border-green-500"
                : "border-stone-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <h2
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold w-14 md:w-[75px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                {cycleClockTimeArray[0]}
              </h2>
              <span
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                {cycleClockTimeArray[1]}
              </h2>
              <span
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                {cycleClockTimeArray[2]}
              </h2>
              <span
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-4xl md:text-6xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-blue-900"
                }`}
              >
                {cycleClockTimeArray[3]}
              </h2>
            </div>
          </div>
          <div className="flex justify-center">
            {isCycleClockRunning ? (
              <button
                type="button"
                className={`text-3xl md:text-5xl lg:text-5xl xl:text-7xl 2xl:text-8xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
                  isCycleClockStopping
                    ? "scale-75 transition-transform duration-300 text-red-200 cursor-not-allowed"
                    : "text-neutral-600 cursor-pointer"
                }`}
                onClick={() => !isCycleClockStopping && stopCycle()}
              >
                Stop
              </button>
            ) : (
              <button
                type="button"
                className={`text-3xl md:text-5xl lg:text-5xl xl:text-7xl 2xl:text-8xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
                  isCycleClockStarting
                    ? "scale-75 transition-transform duration-300 text-green-200 cursor-not-allowed"
                    : "text-green-600 cursor-pointer"
                } ${isAbleToStart ? "" : "text-custom-color cursor-pointer"}`}
                onClick={() => !isCycleClockStarting && runCycle()}
              >
                Start
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CycleClock
