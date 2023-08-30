import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}) {
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
  return await res.json()
}

function useLogin() {
  const query = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      loginUser({
        email,
        password,
      })
  )
  return query
}

export default useLogin
