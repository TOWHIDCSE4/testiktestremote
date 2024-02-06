import {
  API_URL_JOBS,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Job } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Job[]
}

export async function getAllJobs() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_JOBS}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useGetJobs() {
  const query = useQuery(["jobs"], () => getAllJobs(), {
    cacheTime: SIXTEEN_HOURS,
    staleTime: TWELVE_HOURS,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useGetJobs
