import { ONE_DAY, API_URL_PARTS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getPart(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function usePart(id: string | undefined) {
  const query = useQuery(["part", id], () => getPart(id), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  return query
}
export default usePart
