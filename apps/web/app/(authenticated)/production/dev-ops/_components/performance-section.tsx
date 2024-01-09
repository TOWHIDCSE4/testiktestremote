import React, { Suspense } from "react"
import MachineClassesCard from "./machine-classes"
import PerformanceCard from "./performance-card"

interface Props {
  sessionsList: any
}

const PerformanceSection: React.FC<Props> = async ({ sessionsList }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between space-x-2  mt-6">
        <PerformanceCard sessionsList={sessionsList} />
        <Suspense fallback={<div>Loading...</div>}>
          <MachineClassesCard />
        </Suspense>
      </div>
    </div>
  )
}

export default PerformanceSection
