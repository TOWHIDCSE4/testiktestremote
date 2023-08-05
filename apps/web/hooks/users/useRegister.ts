import { I_User } from "../../../web/types/global"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function registerUser({
  firstName,
  lastName,
  department,
  location,
  email,
  password,
}: I_User) {
  const res = await fetch(`${API_URL_USERS}`, {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      department,
      location,
      email,
      password,
    }),
    headers: {
      "content-type": "application/json",
    },
  })

  return res.json()
}

function useRegisterUser() {
  const query = useMutation(
    ({ firstName, lastName, department, location, email, password }: I_User) =>
      registerUser({
        firstName,
        lastName,
        department,
        location,
        email,
        password,
      })
  )

  return query
}

export default useRegisterUser
