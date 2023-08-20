import { ONE_DAY, API_URL_USERS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getUser(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetUser(id: string | undefined) {
  const query = useQuery(["job", id], () => getUser(id), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  return query
}
export default useGetUser
