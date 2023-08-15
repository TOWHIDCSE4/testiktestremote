import { T_User } from "custom-validator"
import { I_User } from "../../../web/types/global"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function registerUser({
  firstName,
  lastName,
  role,
  location,
  email,
  password,
  profile,
}: T_User) {
  const res = await fetch(`${API_URL_USERS}`, {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      role,
      location,
      email,
      password,
      profile,
    }),
    headers: {
      "content-type": "application/json",
    },
  })
  return await res.json()
}

function useRegisterUser() {
  const query = useMutation(
    ({
      firstName,
      lastName,
      role,
      location,
      email,
      password,
      profile,
    }: T_User) =>
      registerUser({
        firstName,
        lastName,
        role,
        location,
        email,
        password,
        profile,
      })
  )

  return query
}

export default useRegisterUser
