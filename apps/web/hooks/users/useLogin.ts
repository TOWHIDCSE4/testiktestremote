import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_LOGIN } from "../../types/global"

export async function loginUser({ email, password }: T_LOGIN) {
  const res = await fetch(`${API_URL_USERS}/login`, {
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

function useLogin() {
  const query = useMutation(({ email, password }: T_LOGIN) =>
    loginUser({
      email,
      password,
    })
  )
  return query
}

export default useLogin
