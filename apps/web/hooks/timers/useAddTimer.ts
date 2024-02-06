import { API_URL_TIMER } from "../../helpers/constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { T_Timer } from "custom-validator"
import Cookies from "js-cookie"

export async function addTimer(data: T_Timer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddTimer() {
  const queryClient = useQueryClient()
  const query = useMutation({
    mutationFn: (data: T_Timer) => addTimer(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["timers-location"])
    },
  })

  return query
}

export default useAddTimer
