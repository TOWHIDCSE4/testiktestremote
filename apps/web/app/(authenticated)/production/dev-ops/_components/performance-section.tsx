import React, { Suspense } from "react"
import MachineClassesCard from "./machine-classes"
import PerformanceCard from "./performance-card"
import { Card, Divider } from "antd"
import { IconButton } from "@mui/material"
import { BiRefresh } from "react-icons/bi"
import { LuMoreVertical } from "react-icons/lu"

const MachineClassesCardSkeleton: React.FC = () => {
  return (
    <Card className="flex-none w-80 h-[40rem] overflow-y-auto">
      <div className="flex items-center justify-between space-x-2 p-2">
        <p className="line-clamp-1 font-semibold leading-tight">
          Timers By Machine Classes
        </p>
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
      <div className="p-2 space-y-">
        <div className="h-5 w-5 animate-spin text-center mt-56">Loading...</div>
      </div>
    </Card>
  )
}
interface Props {
  sessionsList: any
}

const PerformanceSection: React.FC<Props> = ({ sessionsList }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between space-x-2  mt-6">
        <PerformanceCard sessionsList={sessionsList} />
        <Suspense fallback={<MachineClassesCardSkeleton />}>
          <MachineClassesCard />
        </Suspense>
      </div>
    </div>
  )
}

export default PerformanceSection
