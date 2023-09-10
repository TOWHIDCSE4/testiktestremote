import {
  API_URL_USERS,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_User } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_User[]
}

export async function getUsers() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useUsers() {
  const query = useQuery(["users"], () => getUsers(), {
    cacheTime: SIXTEEN_HOURS,
    staleTime: TWELVE_HOURS,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useUsers
