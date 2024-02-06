"use client"
import { Card, Divider, IconButton } from "@mui/material"
import { T_Timer } from "custom-validator"
import { Suspense } from "react"
import { LuMoreVertical } from "react-icons/lu"
import PartSelection from "./part-selection"
import TimerCardClock from "./timer-card-clock"
import TimerUnitsCounter from "./timer-units-counter"

interface Props {
  timer: T_Timer & {
    startAt: string
    endAt: string
    cycleTime: number
    units: number
    sessionName: string
  }
}

const TimerCard: React.FC<Props> = ({ timer }) => {
  return (
    <Card className="w-full">
      <div className="flex items-center justify-between space-x-2 p-2">
        <Suspense fallback={<div>Loading Jobs ....</div>}>
          <PartSelection parts={timer?.parts} defaultPart={timer?.part} />
        </Suspense>
        <IconButton>
          <LuMoreVertical />
        </IconButton>
      </div>
      <Divider />
      <div className="p-2">
        <div className="px-4 py-4 space-y-2 text-center">
          <h3 className="text-xl font-bold text-gray-700 uppercase">
            {timer?.machine?.name}
          </h3>
          <TimerCardClock
            sessionName={timer?.sessionName}
            startAt={new Date(timer?.startAt)}
            endAt={new Date(timer?.endAt)}
            timerId={timer?._id as string}
            unitCycleTime={timer?.cycleTime}
          />
          <p className="text-lg text-amber-600">{`Operator Unassigned`}</p>
          <TimerUnitsCounter
            defaultUnit={timer.units}
            timerId={timer?._id as string}
          />
        </div>
        <div className="px-4">
          <div className="flex justify-between text-gray-900">
            <span>Total Tons:</span>
            <span>0.000</span>
          </div>
          <div className="flex justify-between text-gray-900">
            <span>Average Ton/hr:</span>
            <span>0.000</span>
          </div>
          <div className="flex justify-between text-gray-900">
            <span>Average Unit/hr: </span>
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-2 px-4 py-4">
          <button className="p-1 text-sm text-white uppercase rounded-md bg-stone-300">
            Controller
          </button>
          <button className="p-1 text-sm text-white uppercase rounded-md bg-stone-300">
            Live Camera
          </button>
        </div>
      </div>
    </Card>
  )
}

export default TimerCard
