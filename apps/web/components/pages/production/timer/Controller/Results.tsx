import React from "react"
// import { DarkModeContext } from './DarkModeContext';

const Results = ({
  unitsCreated,
  totals,
}: {
  unitsCreated: number
  totals: {
    unitsPerHour: number
    tonsPerHour: number
    totalTons: number
  }
}) => {
  return (
    <>
      {/* Small screen show timer data */}
      <div className="md:hidden mt-8  dark:bg-dark-blue dark:text-white">
        <h6 className="text-center uppercase text-lg text-gray-500 font-semibold leading-none">
          Units Created
        </h6>
        <h1 className="text-[65px] font-semibold text-gray-300 leading-none mt-2 text-center">
          000
        </h1>
        <h5 className="uppercase text-sm font-medium text-gray-800 mt-4 md:text-right">
          Units Per Hour:{" "}
          <span className="uppercase text-sm font-semibold text-gray-500">
            0
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
      <div className="units relative hidden md:block lg:absolute md:mt-[33vh] lg:mt-0 lg:bottom-[15vh] xl:bottom-[17vh] 2xl:bottom-[14vh] lg:right-12 lg:w-[500px] xl:w-[600px] 2xl:w-[760px]">
        <h6 className="text-right ipadair:mt-0 uppercase text-lg md:text-xl xl:text-[1.7vw] 2xl:text-2xl xl:mt-5 2xl:mt-5 text-gray-500 font-semibold leading-none mb-28  dark:bg-dark-blue dark:text-white">
          Units Created
        </h6>
        <div className="flex ipadair:mt-5 absolute md:space-x-8 items-end md:right-0 top-0 mt-10">
          <div className="-translate-y-1.5 md:-translate-y-2 lg:-translate-y-3.5 md:w-[200px] lg:w-[30rem] xl:-translate-y-6">
            <h5 className="uppercase text-sm md:text-lg xl:text-[1.5vw] ipadair:text-[1rem] 2xl:text-2xl font-medium text-gray-800 mt-2 md:text-right xl:leading-6 grid-cols-4 grid justify-items-stretch">
              <label className="justify-self-end col-span-3 dark:text-white">
                Units Per Hour&nbsp;:
              </label>
              <span className="uppercase text-sm md:text-lg xl:text-[1.5vw] ipadair:text-[1rem] 2xl:text-2xl font-semibold text-gray-500 justify-self-start ml-1  dark:bg-dark-blue dark:text-white">
                {totals?.unitsPerHour ? Math.round(totals?.unitsPerHour) : "0"}
              </span>
            </h5>
            <h5 className="uppercase text-sm md:text-lg xl:text-[1.5vw] ipadair:text-[1rem] 2xl:text-2xl font-medium text-gray-800 mt-2 md:text-right xl:leading-6 grid-cols-4 grid justify-items-stretch">
              <label className="justify-self-end col-span-3 dark:text-white">
                Tons Per Hour&nbsp;:
              </label>
              <span className="uppercase text-sm md:text-lg xl:text-[1.5vw] ipadair:text-[1rem] 2xl:text-2xl font-semibold text-gray-500 justify-self-start  ml-1  dark:bg-dark-blue dark:text-white">
                {totals?.tonsPerHour ? totals?.tonsPerHour.toFixed(3) : "0.000"}
              </span>
            </h5>
            <h5 className="uppercase text-sm md:text-lg xl:text-[1.5vw] ipadair:text-[1rem] 2xl:text-2xl font-medium text-gray-800 mt-2 md:text-right xl:leading-6 grid-cols-4 grid justify-items-stretch dark:text-white">
              <label className="justify-self-end col-span-3">
                Total Tons&nbsp;:
              </label>
              <span className="uppercase text-sm md:text-lg xl:text-[1.5vw] ipadair:text-[1rem] 2xl:text-2xl font-semibold text-gray-500 justify-self-start  ml-1  dark:bg-dark-blue dark:text-white">
                {totals?.totalTons ? totals?.totalTons.toFixed(3) : "0.000"}
              </span>
            </h5>
          </div>
          <h1
            className={`{ dark:text-white text-[75px] ipadair:text-[100px] lg:text-[155px] xl:text-[10vw] 2xl:text-[150px] xl:mt-10 2xl:mt-8 font-semibold text-gray-300 leading-none mt-2}`}
          >
            {/* {unitsCreated < 10
              ?`00${unitsCreated}`
              : unitsCreated < 100
              ? `0${unitsCreated}`
              : unitsCreated} */}
            {unitsCreated < 10 ? (
              <>
                <span className="text-gray-400 ">00</span>
                <span className="text-dark-blue dark:text-white">
                  {unitsCreated}
                </span>
              </>
            ) : unitsCreated < 100 ? (
              <>
                <span className="text-gray-400 ">0</span>
                <span className="text-dark-blue dark:text-white">
                  {unitsCreated}
                </span>
              </>
            ) : (
              <span className="text-dark-blue dark:text-white">
                {unitsCreated}
              </span>
            )}
          </h1>
        </div>
      </div>
    </>
  )
}

export default Results
