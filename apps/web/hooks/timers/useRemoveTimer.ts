import { API_URL_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_Timer } from "custom-validator"
import Cookies from "js-cookie"

export async function removeTimer(id: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useRemoveTimer() {
  const query = useMutation((id: string) => removeTimer(id))

  return query
}

export default useRemoveTimer
