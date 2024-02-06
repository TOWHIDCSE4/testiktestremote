import { API_URL_REPORTS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getReportsByLocationAndMachine() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_REPORTS}/per-location-machine`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetReportByLocationAndMachine() {
  const query = useQuery(
    ["reports", "per-location-machine"],
    () => getReportsByLocationAndMachine(),
    {
      refetchInterval: 3000,
    }
  )
  return query
}
export default useGetReportByLocationAndMachine
