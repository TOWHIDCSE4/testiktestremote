import { API_URL_DASHBOARD_CONFIG } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

interface I_Filters {
  systemLookup: boolean
}

export async function updaterFn(props: I_Filters) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_DASHBOARD_CONFIG}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddDashboardConfig() {
  const query = useMutation((props: I_Filters) => updaterFn(props))
  return query
}

export default useAddDashboardConfig
