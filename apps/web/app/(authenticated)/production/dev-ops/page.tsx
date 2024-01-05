import { Divider } from "@mui/material"
import { T_Location, T_Timer } from "custom-validator"
import dynamic from "next/dynamic"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import React, { cache } from "react"
import { T_DBReturn } from "../../../_types"
import Alerts from "./_components/alerts"
import Analytics from "./_components/analytics"
import EndTimerRangeSlider from "./_components/end-timer-range-slider"
import LocationsSelection from "./_components/locations-component"
import { _Get_Machine_Classes } from "./_components/machine-classes"
import PerformanceSection from "./_components/performance-section"
import SelectMachineClass from "./_components/select-machine-class"
import SliderComponent from "./_components/slider-component"
import TimersGeneratorForm from "./_components/timers-generator-form"
import UnitCycleRange from "./_components/unit-cycle-range"
import WithAuth from "./_components/withAuth"
import SessionSimulation from "./_components/sessions-simulation"
import DashboardMonitoring from "./_components/dashboard-monitoring"
import { API_URL } from "../../../../helpers/constants"

const Timers = dynamic(() => import("./_components/timers"))

export type T_Timer_Group_Types = {
  _id: string
  timers: T_Timer[]
}

const _Get_Timers_by_User = cache(async () => {
  const cookiesStore = cookies()
  const token = cookiesStore.get("tfl")
  const res = await fetch(`${API_URL}/api/timers/dev-ops`, {
    headers: { Authorization: `Bearer ${token?.value}` },
    next: { tags: ["devOps-timers"] },
  })
  return (await res.json()) as T_DBReturn<T_Timer_Group_Types[]>
})

interface Props {
  searchParams: {
    location: string
  }
}

const _Get_Locations = cache(async () => {
  const response = await fetch(`${API_URL}/api/locations`)
  return (await response.json()) as T_DBReturn<T_Location[]>
})

const Page: React.FC<Props> = async ({ searchParams }) => {
  // Get All Machine Classes and Locations and Timers
  const [locations, machineClasses, timersGroups] = await Promise.all([
    _Get_Locations(),
    _Get_Machine_Classes(),
    _Get_Timers_by_User(),
  ])

  // ids or location searchParams key dose not exist
  // then he will redirected to correct url
  if (!searchParams || !searchParams?.location) {
    redirect(
      `/production/dev-ops?location=${encodeURI(
        locations.items
          .map((loc) => loc._id)
          .join(",")
          .toString()
      )}`
    )
  }

  return (
    <WithAuth>
      <div className="bg-white shadow-md rounded-md ">
        <h2 className="p-2 font-semibold">Random Parameters</h2>
        <Divider />
        <div className="flex flex-col md:flex-row justify-between items-center py-2 px-6">
          <div className="flex flex-col space-y-4">
            <LocationsSelection locations={locations} />
            <SelectMachineClass machineClasses={machineClasses} />
          </div>
          <SliderComponent />
          <div className="flex flex-col space-y-2">
            <EndTimerRangeSlider />
            <UnitCycleRange />
          </div>
          <TimersGeneratorForm />
        </div>
      </div>
      <Analytics />
      {timersGroups && <Timers timersGroups={timersGroups} />}
      <SessionSimulation />
      <PerformanceSection />
      <Alerts />
      <DashboardMonitoring />
    </WithAuth>
  )
}

export default Page
