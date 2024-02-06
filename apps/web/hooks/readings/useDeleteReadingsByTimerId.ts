import { API_URL_READINGS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function deleteReadingsByTimerId(timerId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_READINGS}?timerId=${timerId}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeleteReadingsByTimerId() {
  const query = useMutation((timerId: string) =>
    deleteReadingsByTimerId(timerId)
  )
  return query
}

export default useDeleteReadingsByTimerId
