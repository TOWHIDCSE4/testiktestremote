import { API_URL_PARTS, ONE_DAY, THREE_MINUTES } from "../../helpers/constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: number
}

export async function getPartLocationCount(locationId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}/location-count/${locationId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function usePartLocationCount() {
  const [locationIds, setLocationIds] = useState<string[]>([])

  const query = useQuery(
    ["part-location-counts", locationIds],
    () =>
      Promise.all(
        locationIds.map((locationId) => getPartLocationCount(locationId))
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

  return { ...query, setPartLocationIds: setLocationIds }
}
export default usePartLocationCount
