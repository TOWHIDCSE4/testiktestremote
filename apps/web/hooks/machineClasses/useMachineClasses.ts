import {
  API_URL_FACTORIES,
  API_URL_MACHINE_CLASS,
  ONE_DAY,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getAllMachineClasses() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE_CLASS}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useMachineClasses() {
  const query = useQuery(["machine-classes"], () => getAllMachineClasses(), {
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useMachineClasses
