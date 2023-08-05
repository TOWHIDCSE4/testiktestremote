import { I_User } from "../../../web/types/global"
import { API_URL_LOGIN } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function loginUser({ email, password }: I_User) {
  const res = await fetch(`${API_URL_LOGIN}`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "content-type": "application/json",
    },
  })

  return res.json()
}

function useLoginUser() {
  const query = useMutation(({ email, password }: I_User) =>
    loginUser({
      email,
      password,
    })
  )

  return query
}

export default useLoginUser
