import { API_URL_TIMER, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Job } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Job[]
}

export async function getMachineLocationCount(
  locationId: string,
  factoryId: string,
  partId: string
) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER}/timer-jobs?locationId=${locationId}&factoryId=${factoryId}&partId=${partId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return (await res.json()) as T_DBReturn
}

function useGetTimerJobs() {
  const [locationId, setLocationId] = useState("")
  const [factoryId, setFactoryId] = useState("")
  const [partId, setPartId] = useState("")

  const query = useQuery(
    ["timer-jobs", locationId, factoryId, partId],
    () => getMachineLocationCount(locationId, factoryId, partId),
    {
      staleTime: THREE_MINUTES,
      enabled: !!locationId && !!factoryId && !!partId,
    }
  )

  useEffect(() => {
    if (locationId && factoryId && partId) {
      query.refetch()
    }
  }, [locationId, factoryId, partId])

  return { ...query, setLocationId, setFactoryId, setPartId }
}
export default useGetTimerJobs
