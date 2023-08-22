import React from "react"

const Results = ({ unitsCreated }: { unitsCreated: number }) => {
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
    </>
  )
}

export default Results
