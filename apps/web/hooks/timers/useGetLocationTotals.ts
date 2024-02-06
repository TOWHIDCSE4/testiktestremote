import { API_URL_TIMER } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function fetcherfn() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}/totals-by-location`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetLocationTotals() {
  const query = useQuery(["locations-totals"], () => fetcherfn(), {
    refetchOnWindowFocus: false,
  })
  return query
}

export default useGetLocationTotals
