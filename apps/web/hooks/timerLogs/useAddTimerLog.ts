import { API_URL_TIMER, API_URL_TIMER_LOGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_TimerLog } from "custom-validator"
import Cookies from "js-cookie"

export async function addTimerLog({
  partId,
  timerId,
  time,
  operator,
  status,
  stopReason,
}: T_TimerLog) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER_LOGS}`, {
    method: "POST",
    body: JSON.stringify({
      partId,
      timerId,
      time,
      operator,
      status,
      stopReason,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddTimerLog() {
  const query = useMutation(
    ({ partId, timerId, time, operator, status, stopReason }: T_TimerLog) =>
      addTimerLog({
        partId,
        timerId,
        time,
        operator,
        status,
        stopReason,
      })
  )

  return query
}

export default useAddTimerLog
