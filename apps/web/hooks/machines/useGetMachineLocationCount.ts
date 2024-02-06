import { API_URL_MACHINE, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: number
}

export async function getMachineLocationCount(locationId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}/location-count/${locationId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useGetMachineLocationCount() {
  const [locationIds, setLocationIds] = useState<string[]>([])

  const query = useQuery(
    ["machine-location-counts", locationIds],
    () =>
      Promise.all(
        locationIds.map((locationId) => getMachineLocationCount(locationId))
      ),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!locationIds,
    }
  )

  useEffect(() => {
    if (locationIds) {
      query.refetch()
    }
  }, [locationIds])

  return { ...query, setMachineLocationIds: setLocationIds }
}
export default useGetMachineLocationCount
