import {
  API_URL_CONTROLLER_TIMER,
  API_URL_CYCLE_TIMER,
} from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"

export async function endControllerTimer(timerId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CONTROLLER_TIMER}/end`, {
    method: "PATCH",
    body: JSON.stringify({ timerId }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_BackendResponse
}

function useEndControllerTimer() {
  const query = useMutation((timerId: string) => endControllerTimer(timerId))
  return query
}

export default useEndControllerTimer
