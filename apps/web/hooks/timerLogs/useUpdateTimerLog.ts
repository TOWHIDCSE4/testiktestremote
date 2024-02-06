import { T_TimerLog } from "custom-validator"
import { API_URL_TIMER_LOGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateTimerLog(props: T_TimerLog) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER_LOGS}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateTimerLog() {
  const query = useMutation((props: T_TimerLog) => updateTimerLog(props))

  return query
}

export default useUpdateTimerLog
