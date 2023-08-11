import {
  API_URL_FACTORIES,
  ONE_DAY,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getAllFactories() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_FACTORIES}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useFactories() {
  const query = useQuery(["factories"], () => getAllFactories(), {
    staleTime: THREE_MINUTES,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useFactories
