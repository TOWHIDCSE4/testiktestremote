import React from "react"
import MachineClassesCard from "./machine-classes"
import PerformaceCard from "./performace-card"

const PerformanceSection = async () => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between space-x-2  mt-6">
        <PerformaceCard />
        <MachineClassesCard />
      </div>
    </div>
  )
}

export default PerformanceSection
