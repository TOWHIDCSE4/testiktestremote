"use client"
import { Card, Divider, IconButton } from "@mui/material"
import ms from "ms"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"
import useSessions from "../hooks/useSessions"
import Simulation from "./simulation"

const SessionSimulation: React.FC = () => {
  const query = useSessions()
  const sessionsList = query.data
  return query.isLoading || query.isFetching ? (
    <div>Loading ....</div>
  ) : (
    <Card className="">
      <div className="flex items-center justify-between space-x-2 p-2 z-50">
        <h2 className="font-semibold">Previous Simulations</h2>
        <div className="flex items-center space-x-2">
          <IconButton>
            <BiRefresh />
          </IconButton>

          <IconButton>
            <LuMoreVertical />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col space-y-1 mt-2">
        <div className="flex flex-col space-y-1 h-[20 rem] overflow-y-auto">
          {sessionsList?.items?.length ? (
            sessionsList?.items?.map((session: any) => (
              <Simulation
                key={session._id}
                sessionId={session._id}
                description={ms(session.duration ?? 0)}
                heading={session.name}
                noOfAlerts={session.noOfAlerts}
                noOfTimers={session.noOfTimers}
                startedAt={session.createdAt}
                endAt={session.endTime}
                date={session.date}
                cycleMargin={session.unitCycleTime}
                activeTimersRange={session.activeTimersRange}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-40">
              <h2 className="font-semibold text-xl">No Simulations</h2>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default SessionSimulation
