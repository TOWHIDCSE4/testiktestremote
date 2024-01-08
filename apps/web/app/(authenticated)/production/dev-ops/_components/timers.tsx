"use client"
import React, { Suspense } from "react"
import TimerCard from "./timer-card"
import DisplayCurrentUsersTimersSession from "./display-current-user-timers-session"

interface Props {
  timersGroups: any //TODO: Specify the correct type here
  // timersGroupsCounts: number | undefined
}

const timersGroups: React.FC<Props> = ({ timersGroups }) => {
  return (
    <div className="w-full overflow-y-auto max-h-[56rem] mt-4">
      {timersGroups?.items?.map((group: any) => (
        <DisplayCurrentUsersTimersSession
          isCurrentUser={group.isCurrentUser}
          group={group}
        />
      ))}
      {/* {timersGroups?.items?.map((group: any) => (
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
              <TimerCard timer={timer} key={timer._id} />
            ))}
          </div>
        </Suspense>
      ))} */}
    </div>
  )
}

export default timersGroups
