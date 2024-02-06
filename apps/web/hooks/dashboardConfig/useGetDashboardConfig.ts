import { API_URL_DASHBOARD_CONFIG, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function fetcherfn() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DASHBOARD_CONFIG}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetDashboardConfig() {
  const query = useQuery(["dashboard-config"], () => fetcherfn(), {})
  return query
}
export default useGetDashboardConfig
