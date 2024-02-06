import { API_URL_CYCLE_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse, T_CycleTimer } from "custom-validator"
import Cookies from "js-cookie"

export async function addCycleTimer(props: T_CycleTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CYCLE_TIMER}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_BackendResponse
}

function useAddCycleTimer() {
  const query = useMutation((props: T_CycleTimer) => addCycleTimer(props), {
    retry: Number.MAX_SAFE_INTEGER,
    retryDelay: 250,
  })
  return query
}

export default useAddCycleTimer
