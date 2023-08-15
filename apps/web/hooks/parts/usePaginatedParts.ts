import { API_URL_PARTS, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Part[]
}

export async function getAllParts({
  page,
  locationId,
}: {
  page: number
  locationId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_PARTS}/paginated?page=${page}&locationId=${locationId}`,
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

function usePaginatedParts() {
  const [page, setPage] = useState(1)
  const [locationId, setLocationId] = useState("")
  const query = useQuery(
    ["parts", page, locationId],
    () => getAllParts({ page, locationId }),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!page,
    }
  )
  useEffect(() => {
    if (locationId && page) {
      query.refetch()
    }
  }, [page, locationId])

  return { ...query, page, setPage, locationId, setLocationId }
}
export default usePaginatedParts
