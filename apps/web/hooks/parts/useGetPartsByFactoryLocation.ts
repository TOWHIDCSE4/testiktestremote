import { API_URL_PARTS, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Part[]
}

export async function getAllParts({
  locationId,
  factoryId,
}: {
  locationId: string
  factoryId?: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_PARTS}/location-factory?locationId=${locationId}&factoryId=${factoryId}`,
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

function useGetPartsByFactoryLocation() {
  const [locationId, setLocationId] = useState("")
  const [factoryId, setFactoryId] = useState("")
  const query = useQuery(
    ["parts-factory-location", locationId, factoryId],
    () => getAllParts({ locationId, factoryId }),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!factoryId,
    }
  )
  useEffect(() => {
    if (locationId && factoryId) {
      query.refetch()
    }
  }, [locationId, factoryId])

  return {
    ...query,
    locationId,
    setLocationId,
    factoryId,
    setFactoryId,
  }
}
export default useGetPartsByFactoryLocation
