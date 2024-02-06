import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_UserPassword } from "custom-validator"
import Cookies from "js-cookie"

export async function updatePassword({ password, _id }: T_UserPassword) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/password/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      password,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdatePassword() {
  const query = useMutation(({ password, _id }: T_UserPassword) =>
    updatePassword({
      password,
      _id,
    })
  )

  return query
}

export default useUpdatePassword
