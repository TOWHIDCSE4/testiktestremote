import {
  API_URL_LOCATIONS,
  API_URL_MACHINE_CLASS,
  ONE_DAY,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export async function getAllMachineClassesByLocations({
  locations,
  startDate,
  endDate,
}: {
  locations: string[]
  startDate: string
  endDate: string
}) {
  const token = Cookies.get("tfl")
  //@ts-expect-error
  const queryString = new URLSearchParams({ locations }).toString()

  const res = await fetch(
    `${API_URL_LOCATIONS}/machine-class/by-location?${queryString}&startDate=${startDate}&endDate=${endDate}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return await res.json()
}

function useMachineClasses(locations: string[]) {
  const [startDateForMachineClass, setStartDateForMachineClass] =
    useState<string>("")
  const [endDateForMachineClass, setEndDateForMachineClass] =
    useState<string>("")
  const queryKey = [
    "machine-classes-filter",
    locations,
    startDateForMachineClass,
    endDateForMachineClass,
  ] // Include locations in the query key
  const query = useQuery(
    queryKey,
    () =>
      getAllMachineClassesByLocations({
        locations: locations,
        startDate: startDateForMachineClass,
        endDate: endDateForMachineClass,
      }),
    {
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
      // refetchInterval: 200,
    }
  )

  useEffect(() => {
    if (
      locations !== undefined &&
      startDateForMachineClass !== undefined &&
      endDateForMachineClass !== undefined
    ) {
      query.refetch()
    }
  }, [locations, startDateForMachineClass, endDateForMachineClass])
  return { ...query, setStartDateForMachineClass, setEndDateForMachineClass }
}

export default useMachineClasses
