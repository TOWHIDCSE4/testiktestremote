"use client"
import React from "react"
import useDevOpsTimersByUser from "../hooks/useDevOpsTimersByUser"
import useDevOpsTimers from "./_state"
import DisplayCurrentUsersTimersSession from "./display-current-user-timers-session"

const TimersGroups: React.FC = () => {
  const query = useDevOpsTimersByUser()
  const timersGroups = query.data as any
  const setActiveSession = useDevOpsTimers((state) => state.setActiveSession)

  const currentUserSessions = timersGroups?.items?.filter(
    (group: any) => group.isCurrentUser
  )

  const otherUsersSessions = timersGroups?.items?.filter(
    (group: any) => !group.isCurrentUser
  )

  if (currentUserSessions?.length > 0 && otherUsersSessions?.length > 0) {
    setActiveSession(currentUserSessions[0]?._id)
  }

  if (currentUserSessions?.length > 0 && otherUsersSessions?.length === 0) {
    setActiveSession(currentUserSessions[0]?._id)
  }

  if (otherUsersSessions?.length > 0 && currentUserSessions?.length === 0) {
    setActiveSession(otherUsersSessions[0]?._id)
  }

  return query.isLoading || query.isFetching ? (
    <div>Loading ....</div>
  ) : (
    <div className="w-full overflow-y-auto max-h-[56rem] mt-4">
      {timersGroups?.items?.map((group: any) => (
        <DisplayCurrentUsersTimersSession
          key={group._id}
          isCurrentUser={group.isCurrentUser}
          group={group}
        />
      ))}
    </div>
  )
}

export default TimersGroups
