import { API_URL_REPORTS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getReportsByLocation() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_REPORTS}/per-location`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetReportByLocation() {
  const query = useQuery(
    ["reports", "per-location"],
    () => getReportsByLocation(),
    {
      // refetchInterval: 3000,
    }
  )
  return query
}
export default useGetReportByLocation
