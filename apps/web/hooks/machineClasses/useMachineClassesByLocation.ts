import {
  API_URL_LOCATIONS,
  API_URL_MACHINE_CLASS,
  ONE_DAY,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { useEffect, useMemo, useState } from "react"

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

  const LocationsString = locations?.join(",")

  const query = useQuery(
    [
      "machine-classes-filter",
      LocationsString,
      startDateForMachineClass,
      endDateForMachineClass,
    ],
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
    if (locations && startDateForMachineClass && endDateForMachineClass) {
      query.refetch()
    }
  }, [LocationsString, startDateForMachineClass, endDateForMachineClass])
  return { ...query, setStartDateForMachineClass, setEndDateForMachineClass }
}

export default useMachineClasses
