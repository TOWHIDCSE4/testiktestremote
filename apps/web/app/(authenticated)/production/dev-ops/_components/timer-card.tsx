"use client"
import { Card, Divider, IconButton } from "@mui/material"
import { T_Timer } from "custom-validator"
import { Suspense } from "react"
import { LuMoreVertical } from "react-icons/lu"
import useDevOpsTimers from "./_state"
import PartSelection from "./part-selection"
import TimerCardClock from "./timer-card-clock"

interface Props {
  timer: T_Timer & {
    startAt: string
    endAt: string
  }
}

const TimerCard: React.FC<Props> = ({ timer }) => {
  const unit = useDevOpsTimers((state) => state.dailyUnits)?.find(
    (t) => t.timerId === (timer._id as string)
  )?.unit
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
            startAt={new Date(timer?.startAt)}
            endAt={new Date(timer?.endAt)}
            timerId={timer?._id as string}
          />
          <p className="text-lg text-amber-600">{`Operator Unassigned`}</p>
          <div>
            <h2
              className={`text-center font-bold text-5xl ${
                !unit ? "text-stone-400" : "text-stone-800"
              }`}
            >
              {String(unit ?? 0).padStart(3, "0")}
            </h2>
            <h6 className="text-lg font-semibold text-gray-700 uppercase">
              Daily Units
            </h6>
          </div>
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
