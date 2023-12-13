import { API_URL_USERS, FIFTEEN_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_User } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_User[]
}

export async function getOperators() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/operator-list`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useGetOperatorList() {
  const query = useQuery(["users"], () => getOperators(), {
    cacheTime: FIFTEEN_MINUTES,
    staleTime: FIFTEEN_MINUTES,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useGetOperatorList
