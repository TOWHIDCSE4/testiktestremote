import { I_UserUpdate } from "../../types/global"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function updatePassword(
  { password, id }: I_UserUpdate,
  token: string
) {
  const res = await fetch(`${API_URL_USERS}/${id}`, {
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

function useUpdatePassword(token: string) {
  const query = useMutation(({ password, id }: I_UserUpdate) =>
    updatePassword(
      {
        password,
        id,
      },
      token
    )
  )

  return query
}

export default useUpdatePassword
