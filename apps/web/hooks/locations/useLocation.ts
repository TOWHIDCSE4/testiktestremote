import {
  API_URL_LOCATIONS,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Location } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: T_Location
}

export async function getAllLocations(selectedLocationId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_LOCATIONS}/${selectedLocationId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useLocation() {
  const [selectedLocationId, setSelectedLocationId] = useState("")
  const query = useQuery(
    ["location", selectedLocationId],
    () => getAllLocations(selectedLocationId),
    {
      cacheTime: SIXTEEN_HOURS,
      staleTime: TWELVE_HOURS,
      refetchOnWindowFocus: false,
      enabled: selectedLocationId !== "",
    }
  )
  useEffect(() => {
    if (selectedLocationId !== "") {
      query.refetch()
    }
  }, [selectedLocationId])
  return { ...query, setSelectedLocationId }
}
export default useLocation
