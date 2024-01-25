import {
  API_URL_AUTOTIMER,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_AutoTimer } from "custom-validator"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_AutoTimer[]
}

export async function getAllAutoTimers() {
  const res = await fetch(`${API_URL_AUTOTIMER}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return (await res.json()) as T_DBReturn
}

function useAutoTimers() {
  const query = useQuery(["auto-timers"], () => getAllAutoTimers(), {
    cacheTime: SIXTEEN_HOURS,
    staleTime: TWELVE_HOURS,
    refetchOnWindowFocus: false,
  })
  return query
}

export default useAutoTimers
