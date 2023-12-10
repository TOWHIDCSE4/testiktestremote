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

function useGetTimerJobs(locationId: any, factoryId: any, partId: any): any {
  const query = useQuery(
    ["timer-jobs", locationId, factoryId, partId],
    () => getMachineLocationCount(locationId, factoryId, partId),
    {
      enabled: !(!locationId || !partId || !factoryId),
    }
  )

  return { ...query }
}
export default useGetTimerJobs
