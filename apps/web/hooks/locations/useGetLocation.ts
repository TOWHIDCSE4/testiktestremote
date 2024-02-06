import { ONE_DAY, API_URL_LOCATIONS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Location } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: T_Location
}

export async function getLocation(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_LOCATIONS}/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useGetLocation(id: string | undefined) {
  const query = useQuery(["location", id], () => getLocation(id), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  return query
}
export default useGetLocation
