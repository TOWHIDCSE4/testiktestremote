import { T_Timer } from "custom-validator"
import React, { Suspense } from "react"
import { T_DBReturn } from "../../../../_types"
import TimerCard from "./timer-card"
import { T_Timer_Group_Types } from "../page"

interface Props {
  timersGroups: any //TODO: Specify the correct type here
  // timersGroupsCounts: number | undefined
}

const timersGroups: React.FC<Props> = ({ timersGroups }) => {
  return (
    <div className="w-full overflow-y-auto max-h-[56rem] mt-4">
      {timersGroups?.items?.map((group: any) => (
        <Suspense
          key={group?.name}
          fallback={
            <div className="bg-stone-500 rounded-md w-full h-[30rem] shadow-md animate-pulse" />
          }
        >
          <h2 className="p-2 bg-white w-full font-semibold text-sm shadow-lg">
            {group?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-2 my-1">
            {group?.timers?.map((timer: any) => (
              <TimerCard timer={timer} />
            ))}
          </div>
        </Suspense>
      ))}
    </div>
  )
}

export default timersGroups
