import { API_URL_CONTROLLER_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse, T_CycleTimer } from "custom-validator"
import Cookies from "js-cookie"

export async function updateCycleTimer(props: T_CycleTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CONTROLLER_TIMER}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_BackendResponse
}

function useUpdateCycleTimer() {
  const query = useMutation((props: T_CycleTimer) => updateCycleTimer(props))
  return query
}

export default useUpdateCycleTimer
