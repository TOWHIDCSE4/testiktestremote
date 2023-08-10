import { API_URL_USERS } from "../../helpers/constants"
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
    cacheTime: 60 * 60 * 24,
    staleTime: 60 * 60 * 24,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useProfile
