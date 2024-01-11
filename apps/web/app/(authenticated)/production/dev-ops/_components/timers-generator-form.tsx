"use client"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { API_URL } from "../../../../../helpers/constants"
import useDevOpsTimers from "./_state"
import { revalidateDevOpsTimers } from "./actions"

type DevOpsTimerTypes = {
  noOfTimers: number
  locationId: string
  startTime: number
  // endTime: Date | null
  unitCycleTime: number[]
  machineClassIds: string[] | string
  name: string
  noOfAlerts: number
  endTimeRange: number[]
}

const TimersGeneratorForm = () => {
  const pathname = usePathname()
  const router = useRouter()
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
      if (!data.noOfTimers) toast.error("Please provide number of timers")
      if (!data.startTime) toast.error("Please provide start time")
      // if (!data.endTime) toast.error("Please provide end time range")
      if (!data.unitCycleTime) toast.error("Please provide unit cycle time")
      if (!data.machineClassIds) toast.error("Please provide machine classes")
      if (!data.locationId) toast.error("Please provide location id")
      if (!data.name) toast.error("Please provide session name")

      const token = Cookies.get("tfl")
      const res = await fetch(`${API_URL}/api/dev-ops/session-create`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      return await res.json()
    },
    onSuccess: () => {
      revalidateDevOpsTimers()
      router.replace(pathname)
      toast.success("Timers has been generated")
    },
    onError: (e) => {
      console.log("[ERROR_FROM_GENERATE_TIMERS]", e)
      toast.error("Something went wrong..")
    },
  })

  const onSubmit = () => {
    devOpsTimers.mutate({
      name: sessionName,
      // endTime: null,
      noOfTimers: numberOfTimers,
      noOfAlerts: 3,
      machineClassIds: selectedMachineClasses,
      unitCycleTime: unitCycleTime,
      startTime: startTime,
      endTimeRange: endTimeRange,
      locationId: locationId,
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
        disabled={
          devOpsTimers.isLoading ||
          !sessionName ||
          !startTime ||
          !unitCycleTime ||
          !selectedMachineClasses?.length ||
          !locationId ||
          !numberOfTimers
        }
        type="submit"
        className="p-2 rounded-md w-full bg-[#102136] shadow-md border-1 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {devOpsTimers.isLoading ? `Generating ...` : `Generate`}
      </button>

      <span className="italic">
        {locationId?.split(",")?.length * numberOfTimers} Timers
      </span>
    </div>
  )
}

export default TimersGeneratorForm
