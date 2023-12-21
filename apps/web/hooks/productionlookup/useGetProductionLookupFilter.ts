import { API_URL_PROFILE_LOOKUP, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function fetcherfn() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PROFILE_LOOKUP}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetProfileLookup() {
  const query = useQuery(["profile-lookup"], () => fetcherfn(), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useGetProfileLookup
