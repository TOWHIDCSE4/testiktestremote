import { T_User } from "custom-validator"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateUser(props: T_User) {
  const token = Cookies.get("tfl")
  console.log("props._id", props)
  const res = await fetch(`${API_URL_USERS}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateUser() {
  const query = useMutation((props: T_User) => updateUser(props))
  return query
}

export default useUpdateUser
