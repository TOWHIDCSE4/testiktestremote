import React from "react"

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
      <div className="units relative hidden md:block lg:absolute md:mt-[50vh] lg:mt-0 lg:bottom-[28vh] xl:bottom-[28vh] 2xl:bottom-[25vh] lg:right-12 lg:w-[500px] xl:w-[600px] 2xl:w-[760px]">
        <h6 className="text-right uppercase text-lg md:text-xl xl:text-[1.7vw] 2xl:text-3xl text-gray-500 font-semibold leading-none">
          Units Created
        </h6>
        <div className="flex absolute md:space-x-8 items-end md:right-0 top-0">
          <div className="-translate-y-1.5 md:-translate-y-2 lg:-translate-y-3.5 md:w-[220px] lg:w-auto xl:-translate-y-6">
            <h5 className="uppercase text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-medium text-gray-800 mt-2 md:text-right xl:leading-6">
              Units Per Hour:{" "}
              <span className="uppercase text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-semibold text-gray-500">
                {totals?.unitsPerHour.toFixed(3)}
              </span>
            </h5>
            <h5 className="uppercase text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-medium text-gray-800 mt-2 md:text-right xl:leading-6">
              Tons Per Hour:{" "}
              <span className="uppercase text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-semibold text-gray-500">
                {totals?.tonsPerHour.toFixed(3)}
              </span>
            </h5>
            <h5 className="uppercase text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-medium text-gray-800 mt-2 md:text-right xl:leading-6">
              Total Tons:{" "}
              <span className="uppercase text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-semibold text-gray-500">
                {totals?.totalTons.toFixed(3)}
              </span>
            </h5>
          </div>
          <h1 className="text-[65px] md:text-[130px] lg:text-[140px] xl:text-[12vw] 2xl:text-[195px] font-semibold text-gray-300 leading-none mt-2">
            {unitsCreated < 10
              ? `00${unitsCreated}`
              : unitsCreated < 100
              ? `0${unitsCreated}`
              : unitsCreated}
          </h1>
        </div>
      </div>
    </>
  )
}

export default Results
