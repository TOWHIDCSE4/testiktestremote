import { API_URL_PARTS, API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function acceptUser({
  _id,
  userId,
}: {
  _id: string
  userId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/accept/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({ userId }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAcceptUser() {
  const query = useMutation(
    ({ _id, userId }: { _id: string; userId: string }) =>
      acceptUser({
        _id,
        userId,
      })
  )
  return query
}

export default useAcceptUser
