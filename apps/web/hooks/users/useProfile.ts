import { API_URL_USERS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"

export async function getProfile(email: string, token: string) {
  const res = await fetch(`${API_URL_USERS}/profile/${email}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useProfile(email: string, token: string) {
  const query = useQuery(["profile", email], () => getProfile(email, token), {
    refetchOnWindowFocus: false,
  })
  return query
}
export default useProfile
