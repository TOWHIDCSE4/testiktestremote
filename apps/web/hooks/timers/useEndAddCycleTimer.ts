import { API_URL_CYCLE_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"

export async function endAddCycleTimer(timerId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CYCLE_TIMER}/end-add`, {
    method: "POST",
    body: JSON.stringify({ timerId }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_BackendResponse
}

function useEndAddCycleTimer() {
  const query = useMutation((timerId: string) => endAddCycleTimer(timerId))
  return query
}

export default useEndAddCycleTimer
