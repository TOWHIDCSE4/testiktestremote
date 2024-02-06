import { API_URL_MACHINE, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getAllMachines() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useMachines() {
  const query = useQuery(["machines"], () => getAllMachines(), {
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useMachines
