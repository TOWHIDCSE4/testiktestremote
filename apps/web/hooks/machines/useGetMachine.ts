import {
  ONE_DAY,
  API_URL_PARTS,
  API_URL_MACHINE,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getMachine(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetMachine(id: string | undefined) {
  const query = useQuery(["machine", id], () => getMachine(id), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  return query
}
export default useGetMachine
