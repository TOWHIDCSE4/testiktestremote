import { API_URL_USERS, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_User } from "custom-validator"
import Cookies from "js-cookie"
import useStoreSession from "../../store/useStoreSession"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: T_User
}

export async function getProfile(email: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/profile/${email}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useProfile() {
  const storeSession = useStoreSession((state) => state)
  const query = useQuery(
    ["profile", storeSession.email],
    () => getProfile(storeSession.email),
    {
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
      enabled: !!storeSession.email,
    }
  )
  return query
}
export default useProfile
