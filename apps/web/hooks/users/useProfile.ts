import { API_URL_USERS, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getProfile(email: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/profile/${email}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useProfile(email: string) {
  const query = useQuery(["profile", email], () => getProfile(email), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    enabled: !!email,
  })
  return query
}
export default useProfile
