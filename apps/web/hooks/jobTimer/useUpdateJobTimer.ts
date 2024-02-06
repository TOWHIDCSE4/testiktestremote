import { T_JobTimer } from "custom-validator"
import { API_URL_JOB_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateJobTimer(props: T_JobTimer) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_JOB_TIMER}/update-controller/${props._id}`,
    {
      method: "PATCH",
      body: JSON.stringify(props),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!res.ok) {
    const errrorJson = await res.json()
    throw new Error(errrorJson?.message || "Job Change Unexpected Error")
  }
  return await res.json()
}

function useUpdateJobTimer() {
  const query = useMutation((props: T_JobTimer) => updateJobTimer(props))
  return query
}

export default useUpdateJobTimer
