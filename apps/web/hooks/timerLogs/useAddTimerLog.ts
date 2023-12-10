import { API_URL_TIMER_LOGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_BackendResponse, T_TimerLog } from "custom-validator"
import Cookies from "js-cookie"

export async function addTimerLog(props: T_TimerLog) {
  const token = Cookies.get("tfl")
  console.log("tung tung tung 3", props)

  const res = await fetch(`${API_URL_TIMER_LOGS}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  console.log("tung tung tung 4", res.body)

  const data = (await res.json()) as T_BackendResponse
  return data
}

function useAddTimerLog() {
  const query = useMutation({
    mutationFn: (props: T_TimerLog) => addTimerLog(props),
    onError: () => {},
    onSuccess: () => {},
    onSettled: (data) => {
      console.log("tung tung tung 2", data)
    },
  })

  return query
}

export default useAddTimerLog
