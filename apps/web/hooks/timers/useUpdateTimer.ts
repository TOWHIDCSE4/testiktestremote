import { T_Timer } from "custom-validator"
import { API_URL_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updatePart(props: T_Timer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateTimer() {
  const query = useMutation((props: T_Timer) => updatePart(props))
  return query
}

export default useUpdateTimer
