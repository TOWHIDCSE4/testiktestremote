import {
  API_URL_LOCATIONS,
  API_URL_MACHINE_CLASS,
  ONE_DAY,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getAllMachineClassesByLocations(locations: string[]) {
  const token = Cookies.get("tfl")
  //@ts-expect-error
  const queryString = new URLSearchParams({ locations }).toString()

  const res = await fetch(
    `${API_URL_LOCATIONS}/machine-class/by-location?${queryString}`,
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
  const queryKey = ["machine-classes", locations] // Include locations in the query key
  const query = useQuery(
    queryKey,
    () => getAllMachineClassesByLocations(locations),
    {
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
    }
  )
  return query
}

export default useMachineClasses
