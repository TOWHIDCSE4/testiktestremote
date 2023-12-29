import { T_Timer } from "custom-validator"
import React, { Suspense } from "react"
import { T_DBReturn } from "../../../../_types"
import TimerCard from "./timer-card"

interface Props {
  timers: T_DBReturn<T_Timer[]> | undefined
  // timersCounts: number | undefined
}

const Timers: React.FC<Props> = ({ timers }) => {
  return (
    <div className="w-full overflow-y-auto max-h-[56rem] mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 my-1">
        {timers?.items?.map((timer: any) => (
          <Suspense
            key={timer?._id}
            fallback={
              <div className="bg-stone-500 rounded-md w-full h-[30rem] shadow-md animate-pulse" />
            }
          >
            <TimerCard timer={timer} />
          </Suspense>
        ))}
      </div>
    </div>
  )
}

export default Timers
