import { API_URL_CONTROLLER_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse, T_ControllerTimer } from "custom-validator"
import Cookies from "js-cookie"

export async function addControllerTimer(props: T_ControllerTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CONTROLLER_TIMER}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_BackendResponse
}

function useAddControllerTimer() {
  const query = useMutation((props: T_ControllerTimer) =>
    addControllerTimer(props)
  )
  return query
}

export default useAddControllerTimer
