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
}: T_Props) => {
  return (
    <div className="timer">
      <div className="flex items-center gap-2 justify-end">
        <h6 className="text-center md:text-right uppercase text-md xl:text-lg 2xl:text-3xl text-gray-500 font-semibold">
          Time:
        </h6>
        <div className="flex items-center">
          <h6 className="text-center md:text-right uppercase text-md xl:text-lg 2xl:text-3xl text-gray-500 font-semibold">
            {timerClockTimeArray[0]}
          </h6>
          <span className="text-center md:text-right uppercase text-md xl:text-lg 2xl:text-3xl text-gray-500 font-semibold">
            :
          </span>
          <h6 className="text-center md:text-right uppercase text-md xl:text-lg 2xl:text-3xl text-gray-500 font-semibold">
            {timerClockTimeArray[1]}
          </h6>
          <span className="text-center md:text-right uppercase text-md xl:text-lg 2xl:text-3xl text-gray-500 font-semibold">
            :
          </span>
          <h6 className="text-center md:text-right uppercase text-md xl:text-lg 2xl:text-3xl text-gray-500 font-semibold">
            {timerClockTimeArray[2]}
          </h6>
        </div>
      </div>
      <div className="md:float-right mt-2">
        <div className="">
          <div
            className={`countdown-container rounded-md bg-[#f1f2e1] pt-2 pb-3.5 px-5 border-2 ${
              progress > 100
                ? "border-red-500"
                : isCycleClockRunning
                ? "border-green-500"
                : "border-stone-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <h2
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
                }`}
              >
                {cycleClockTimeArray[0]}
              </h2>
              <span
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
                }`}
              >
                {cycleClockTimeArray[1]}
              </h2>
              <span
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
                }`}
              >
                {cycleClockTimeArray[2]}
              </h2>
              <span
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
                }`}
              >
                :
              </span>
              <h2
                className={`text-center text-4xl lg:text-6xl xl:text-8xl 2xl:text-[136px] font-bold ${
                  !isCycleClockRunning ? "text-stone-300" : "text-stone-800"
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
                className={`text-3xl lg:text-5xl xl:text-7xl 2xl:text-8xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
                  isCycleClockStopping
                    ? "scale-75 transition-transform duration-300 text-red-200 cursor-not-allowed"
                    : "text-red-600 cursor-pointer"
                }`}
                onClick={() => !isCycleClockStopping && stopCycle()}
              >
                Stop
              </button>
            ) : (
              <button
                type="button"
                className={`text-3xl lg:text-5xl xl:text-7xl 2xl:text-8xl w-36 xl:w-60 2xl:w-80 mt-2 tracking-wider text-center font-semibold uppercase ${
                  isCycleClockStarting
                    ? "scale-75 transition-transform duration-300 text-green-200 cursor-not-allowed"
                    : "text-green-600 cursor-pointer"
                }`}
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
