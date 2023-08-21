import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function deleteUser(id: String) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useDeleteUser() {
  const query = useMutation((id: string) => deleteUser(id))

  return query
}

export default useDeleteUser
