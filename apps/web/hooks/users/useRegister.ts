import { T_User } from "custom-validator"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function registerUser(props: T_User) {
  const res = await fetch(`${API_URL_USERS}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
    },
  })
  return await res.json()
}

function useRegisterUser() {
  const query = useMutation((props: T_User) => registerUser(props))

  return query
}

export default useRegisterUser
