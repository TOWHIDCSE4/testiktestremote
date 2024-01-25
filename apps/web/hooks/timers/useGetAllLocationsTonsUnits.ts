import {
  API_URL_ALL_LOCATIONS_TOTAL_TONSUNIT,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function fetcherfn() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_ALL_LOCATIONS_TOTAL_TONSUNIT}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetAllLocationTonsUnits() {
  const query = useQuery(["all-location-tons-units"], () => fetcherfn(), {
    refetchOnWindowFocus: false,
  })
  return query
}

export default useGetAllLocationTonsUnits
