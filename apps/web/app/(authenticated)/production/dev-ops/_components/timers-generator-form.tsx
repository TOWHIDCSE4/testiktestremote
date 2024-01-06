"use client"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { NEXT_PUBLIC_API_URL } from "../../../../../helpers/constants"
import useDevOpsTimers from "./_state"
import { revalidateDevOpsTimers } from "./actions"

type DevOpsTimerTypes = {
  numberOfTimers: number
  locationId: string
  startTime: number
  endTimeRange: number[]
  unitCycleTime: number[]
  selectedMachineClasses: string[] | string
  sessionName: string
}

const TimersGeneratorForm = () => {
  const sessionName = useDevOpsTimers((state) => state.sessionName)
  const setSessionName = useDevOpsTimers((state) => state.setSessionName)
  const setNumberOfTimers = useDevOpsTimers((state) => state.setNumberOfTimers)
  const startTime = useDevOpsTimers((state) => state.startTime)
  const endTimeRange = useDevOpsTimers((state) => state.endTimerRange)
  const numberOfTimers = useDevOpsTimers((state) => state.numberOfTimers)
  const selectedMachineClasses = useDevOpsTimers(
    (state) => state.selectedMachineClasses
  )
  const unitCycleTime = useDevOpsTimers((state) => state.unitCycleTime)

  const searchParams = useSearchParams()
  const locationId = searchParams.get("location") as string

  const devOpsTimers = useMutation({
    mutationFn: async (data: DevOpsTimerTypes) => {
      if (!data.numberOfTimers) toast.error("Please provide number of timers")
      if (!data.startTime) toast.error("Please provide start time")
      if (!data.endTimeRange) toast.error("Please provide end time range")
      if (!data.unitCycleTime) toast.error("Please provide unit cycle time")
      if (!data.selectedMachineClasses)
        toast.error("Please provide machine classes")
      if (!data.locationId) toast.error("Please provide location id")
      if (!data.sessionName) toast.error("Please provide session name")

      const token = Cookies.get("tfl")
      const res = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/timers/dev-ops-timers`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return await res.json()
    },
    onSuccess: () => {
      revalidateDevOpsTimers()
      toast.success("Timers has been generated")
    },
    onError: (e) => {
      console.log("[ERROR_FROM_GENERATE_TIMERS]", e)
      toast.error("Something went wrong..")
    },
  })

  const onSubmit = () => {
    devOpsTimers.mutate({
      locationId,
      numberOfTimers,
      startTime,
      endTimeRange,
      unitCycleTime,
      selectedMachineClasses,
      sessionName,
    })
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        type="text"
        value={sessionName}
        placeholder="Session Name"
        className="rounded-md shadow-md"
        onChange={(e) => setSessionName(e.target.value)}
      />
      <input
        type="number"
        placeholder="No of timers"
        className="rounded-md shadow-md"
        onChange={(e) => setNumberOfTimers(Number(e.target.value))}
      />
      <button
        onClick={onSubmit}
        disabled={devOpsTimers.isLoading}
        type="submit"
        className="p-2 rounded-md w-full bg-[#102136] shadow-md border-1 text-white"
      >
        {devOpsTimers.isLoading ? "Generating ..." : "Generate"}
      </button>
    </div>
  )
}

export default TimersGeneratorForm