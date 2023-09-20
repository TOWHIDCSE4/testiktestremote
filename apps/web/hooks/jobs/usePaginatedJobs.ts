import {
  API_URL_JOBS,
  REFETCH_ACTIVATED,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Job, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Job[]
}

export async function getAllParts({
  page,
  locationId,
  status,
}: {
  page: number
  locationId: string
  status?: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_JOBS}/paginated?page=${page}&locationId=${locationId}&status=${status}`,
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

function usePaginatedJobs() {
  const [page, setPage] = useState(1)
  const [locationId, setLocationId] = useState("")
  const [status, setStatus] = useState("")
  const query = useQuery(
    ["jobs", page, locationId, status],
    () => getAllParts({ page, locationId, status }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!page,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )
  useEffect(() => {
    if (locationId && page) {
      query.refetch()
    }
  }, [page, locationId])

  return {
    ...query,
    page,
    setPage,
    locationId,
    setLocationId,
    status,
    setStatus,
  }
}
export default usePaginatedJobs
