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
  search,
  jobType,
}: {
  page: number
  locationId: string
  status?: string
  search?: string
  jobType?: string
}) {
  const token = Cookies.get("tfl")
  // console.log(search, "Job" , jobType)
  const res = await fetch(
    `${API_URL_JOBS}/paginated?page=${page}&locationId=${locationId}&status=${status}&search=${search}&selectedjob=${jobType}`,
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
  const [search, setSearch] = useState("")
  const [jobType, setJobType] = useState("")
  const query = useQuery(
    ["jobs", page, locationId, status, search, jobType],
    () => getAllParts({ page, locationId, status, search, jobType }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!page,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )
  useEffect(() => {
    if (locationId && page && search && jobType) {
      query.refetch()
    }
  }, [page, locationId, search, jobType])

  return {
    ...query,
    page,
    setPage,
    locationId,
    setLocationId,
    status,
    setStatus,
    search,
    setSearch,
    jobType,
    setJobType,
  }
}
export default usePaginatedJobs
