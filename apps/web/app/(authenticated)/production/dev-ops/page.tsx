import { Divider } from "@mui/material"
import { T_Location, T_Timer } from "custom-validator"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import React, { cache } from "react"
import { API_URL } from "../../../../helpers/constants"
import { T_DBReturn } from "../../../_types"
import { _Get_Machine_Classes } from "./_components/actions"
import Alerts from "./_components/alerts"
import Analytics from "./_components/analytics"
import DashboardMonitoring from "./_components/dashboard-monitoring"
import EndTimerRangeSlider from "./_components/end-timer-range-slider"
import LocationsSelection from "./_components/locations-component"
import PerformanceSection from "./_components/performance-section"
import SelectMachineClass from "./_components/select-machine-class"
import SessionSimulation from "./_components/sessions-simulation"
import SliderComponent from "./_components/slider-component"
import TimersGroups from "./_components/timers"
import TimersGeneratorForm from "./_components/timers-generator-form"
import UnitCycleRange from "./_components/unit-cycle-range"
import WithAuth from "./_components/withAuth"

export type T_Timer_Group_Types = {
  _id: string
  timers: T_Timer[]
}

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
  const locations = await _Get_Locations()

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
        <h2 className="p-2 font-semibold">Start New Stress Sim</h2>
        <Divider />
        <div className="flex flex-col md:flex-row justify-between items-center py-2 px-6">
          <div className="flex flex-col space-y-4">
            <LocationsSelection locations={locations} />
            <SelectMachineClass />
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
      <TimersGroups />
      <SessionSimulation />
      <PerformanceSection />
      <Alerts />
      <DashboardMonitoring />
    </WithAuth>
  )
}

export default Page
