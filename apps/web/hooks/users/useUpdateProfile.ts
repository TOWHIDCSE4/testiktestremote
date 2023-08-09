import { I_UserUpdate } from "../../types/global"
import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function updateBasicInfo(
  { firstName, lastName, email, id }: I_UserUpdate,
  token: string
) {
  const res = await fetch(`${API_URL_USERS}/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateBasicInfo(token: string) {
  const query = useMutation(
    ({ firstName, lastName, email, id }: I_UserUpdate) =>
      updateBasicInfo(
        {
          firstName,
          lastName,
          email,
          id,
        },
        token
      )
  )

  return query
}

export default useUpdateBasicInfo
