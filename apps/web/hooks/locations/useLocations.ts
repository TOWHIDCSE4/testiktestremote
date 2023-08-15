import {
  API_URL_LOCATIONS,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Locations } from "custom-validator"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Locations[]
}

export async function getAllLocations() {
  const res = await fetch(`${API_URL_LOCATIONS}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
  return (await res.json()) as T_DBReturn
}

function useLocations() {
  const query = useQuery(["locations"], () => getAllLocations(), {
    cacheTime: SIXTEEN_HOURS,
    staleTime: TWELVE_HOURS,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useLocations
