import React from "react"

function TimerSectionLoading() {
  return (
    <>
      <div>
        <div className="md:flex justify-between mt-7">
          <div className="animate-pulse flex space-x-4">
            <div className="h-8 w-80 bg-slate-200 rounded"></div>
          </div>

          <div className="animate-pulse flex space-x-4">
            <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
        </div>

        <>
          <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
            <div className="animate-pulse flex space-x-4">
              <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
            </div>

            <div className="animate-pulse flex space-x-4">
              <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
            </div>

            <div className="animate-pulse flex space-x-4">
              <div className="h-[25rem] w-full mt-7 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div>
            <div className="animate-pulse flex space-x-4 mt-7">
              <div className="h-8 w-[24rem] bg-slate-200 rounded"></div>
            </div>
            <div className="animate-pulse flex space-x-4 mt-7">
              <div className="h-[25rem] w-full bg-slate-200 rounded"></div>
            </div>
          </div>
        </>
      </div>
      <div className="w-full h-[2.2px] bg-gray-200 mt-7"></div>
    </>
  )
}

export default TimerSectionLoading
