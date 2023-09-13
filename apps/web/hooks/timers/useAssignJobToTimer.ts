import { API_URL_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_JobStatus, T_Timer } from "custom-validator"
import Cookies from "js-cookie"

type T_AssignJobToTimer = {
  locationId: string
  partId: string
  factoryId: string
  timerId: string
  status: T_JobStatus
}

export async function assignJobToTimer(data: T_AssignJobToTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}/assign-job`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAssignJobToTimer() {
  const query = useMutation((data: T_AssignJobToTimer) =>
    assignJobToTimer(data)
  )
  return query
}

export default useAssignJobToTimer
