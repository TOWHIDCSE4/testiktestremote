import { API_URL_TIMER_LOGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function deleteTimeLog(id: String) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER_LOGS}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeleteTimeLog() {
  const query = useMutation((id: string) => deleteTimeLog(id))

  return query
}

export default useDeleteTimeLog
