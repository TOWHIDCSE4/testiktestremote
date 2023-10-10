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
    <div className="timer  dark:bg-black dark:text-white">
      <div className="flex items-center gap-2 justify-end  dark:bg-black dark:text-white">
        <h6 className="text-center md:text-right uppercase text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl text-gray-500 font-semibold">
          Time:
        </h6>
        <div className="flex justify-center items-center  dark:bg-black dark:text-white">
          <h6 className="text-center uppercase text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl text-gray-500 font-semibold w-[24px] xl:w-[28px] 2xl:w-[37px]">
            {timerClockTimeArray[0]}
          </h6>
          <span className="text-center uppercase text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl text-gray-500 font-semibold w-[8px] xl:w-[10px]">
            :
          </span>
          <h6 className="text-center uppercase text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl text-gray-500 font-semibold w-[24px] xl:w-[28px] 2xl:w-[37px]">
            {timerClockTimeArray[1]}
          </h6>
          <span className="text-center uppercase text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl text-gray-500 font-semibold w-[8px] xl:w-[10px]">
            :
          </span>
          <h6 className="text-center uppercase text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl text-gray-500 font-semibold w-[24px] xl:w-[28px] 2xl:w-[37px]">
            {timerClockTimeArray[2]}
          </h6>
        </div>
      </div>
      <div className="md:float-right mt-2  dark:bg-black dark:text-white">
        <div className="text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl">
          <div
            className={`countdown-container w-full md:w-[400px] lg:w-[570px] xl:w-[725px] 2xl:w-[950px] rounded-md border-2 border-b-4 border-stone-500 border-b-green-500  bg-[#f1f2e1] pt-2 pb-3.5 px-5  ${
              progress > 100
                ? "border-red-500"
                : isCycleClockRunning || isCycleClockStopping
                ? "border-green-500"
                : "border-stone-500"
            }`}
          >
            <div className="flex items-center justify-center lg:space-x-4 md:space-x-3 xl:space-x-1 2xl:space-x-0 md:mr-5 lg:mr-4 xl:mr-2 2xl:mr-0">
              <h2
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold w-14 md:w-[75px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                {cycleClockTimeArray[0]}
              </h2>
              <span
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                {cycleClockTimeArray[1]}
              </h2>
              <span
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                {cycleClockTimeArray[2]}
              </h2>
              <span
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[145px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
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
                    ? "scale-75 transition-transform duration-300 text-neutral-200 cursor-not-allowed"
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
