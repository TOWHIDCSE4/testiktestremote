import {
  API_URL_JOBS,
  REFETCH_ACTIVATED,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: number
}

export async function getStatusCount(locationId: string, status: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_JOBS}/status-counts?locationId=${locationId}&status=${status}`,
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

function useCountStatus() {
  const [statuses, setStatuses] = useState<string[]>([])
  const [jobLocationId, setJobLocationid] = useState("")
  const query = useQuery(
    ["job-status-counts", statuses],
    () =>
      Promise.all(
        statuses.map((status) => getStatusCount(jobLocationId, status))
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!statuses && !!jobLocationId,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )

  useEffect(() => {
    if (statuses.length > 0 && jobLocationId !== "") {
      query.refetch()
    }
  }, [jobLocationId, statuses])

  return {
    ...query,
    setJobStatuses: setStatuses,
    setJobLocation: setJobLocationid,
  }
}
export default useCountStatus
