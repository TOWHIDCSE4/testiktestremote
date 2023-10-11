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
    <div className="timer  dark:bg-dark-blue dark:text-white">
      <div className="flex items-center gap-2 justify-end  dark:bg-dark-blue dark:text-white">
        <h6 className="text-center md:text-right uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold dark:text-white">
          Time:
        </h6>
        <div className="flex justify-center items-center  dark:bg-dark-blue dark:text-white xl:space-x-0 2xl:space-x-1 lg:space-x-1">
          <h6 className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] md:[30px] xl:w-[28px] 2xl:w-[37px] dark:text-white">
            {timerClockTimeArray[0]}
          </h6>
          <span className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[8px] md:[30px] xl:w-[10px] dark:text-white ">
            :
          </span>
          <h6 className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] md:[30px] xl:w-[28px] 2xl:w-[37px] dark:text-white">
            {timerClockTimeArray[1]}
          </h6>
          <span className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[8px] md:[30px] xl:w-[10px] dark:text-white">
            :
          </span>
          <h6 className="text-center uppercase text-lg md:text-2xl xl:text-[1.5vw] 2xl:text-3xl text-gray-500 font-semibold w-[24px] md:[30px] xl:w-[28px] 2xl:w-[37px] dark:text-white">
            {timerClockTimeArray[2]}
          </h6>
        </div>
      </div>
      <div className="md:float-right mt-2  dark:bg-dark-blue dark:text-white">
        <div className="text-lg md:text-xl xl:text-[2vw] 2xl:text-4xl">
          <div
            className={`countdown-container w-full ipadair:w-[385px] lg:w-[570px] xl:w-[680px] 2xl:w-[800px] rounded-md border-2 border-b-4 border-stone-500 border-b-green-500  bg-[#f1f2e1] pt-2 pb-3.5  ${
              progress > 100
                ? "border-red-500"
                : isCycleClockRunning || isCycleClockStopping
                ? "border-green-500"
                : "border-stone-500"
            }`}
          >
            <div className="flex items-center justify-center ipadair:space-x-0 lg:space-x-6 xl:space-x-1 2xl:space-x-0 ipadair:mr-0 lg:mr-4 xl:mr-2 2xl:mr-0">
              <h2
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-10 md:w-[75px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                {cycleClockTimeArray[0]}
              </h2>
              <span
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                {cycleClockTimeArray[1]}
              </h2>
              <span
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                {cycleClockTimeArray[2]}
              </h2>
              <span
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold ${
                  !isCycleClockRunning || isCycleClockStopping
                    ? "text-stone-300"
                    : "text-dark-blue"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-5xl ipadair:text-6xl lg:text-8xl xl:text-[7rem] 2xl:text-[120px] font-bold w-14 md:w-[80px] lg:w-[87px] xl:w-[140px] 2xl:w-[180px] ${
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
                className={`text-3xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
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
                className={`text-3xl md:text-5xl lg:text-5xl xl:text-xl 2xl:text-6xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
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
