import { T_TimerLog } from "custom-validator"
import { API_URL_TIMER_LOGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateTimerLog({
  _id,
  partId,
  timerId,
  time,
  operator,
  status,
  stopReason,
}: T_TimerLog) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER_LOGS}/${_id}`, {
    method: "PATCH",
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

function useUpdateTimerLog() {
  const query = useMutation(
    ({
      _id,
      partId,
      timerId,
      time,
      operator,
      status,
      stopReason,
    }: T_TimerLog) =>
      updateTimerLog({
        _id,
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

export default useUpdateTimerLog
