import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_User_Password } from "custom-validator"
import Cookies from "js-cookie"

export async function updatePassword({ password, _id }: T_User_Password) {
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
  const query = useMutation(({ password, _id }: T_User_Password) =>
    updatePassword({
      password,
      _id,
    })
  )

  return query
}

export default useUpdatePassword
