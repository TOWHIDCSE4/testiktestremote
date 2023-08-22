import { API_URL_CONTROLLER_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse, T_ControllerTimer } from "custom-validator"
import Cookies from "js-cookie"

export async function updateControllerTimer(props: T_ControllerTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CONTROLLER_TIMER}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_BackendResponse
}

function useUpdateControllerTimer() {
  const query = useMutation((props: T_ControllerTimer) =>
    updateControllerTimer(props)
  )
  return query
}

export default useUpdateControllerTimer
