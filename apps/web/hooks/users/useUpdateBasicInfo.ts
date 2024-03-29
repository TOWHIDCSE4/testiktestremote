import { API_URL_USERS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { T_UserBasic } from "custom-validator"

export async function updateBasicInfo({
  firstName,
  lastName,
  email,
  locationId,
  _id,
}: T_UserBasic) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      firstName,
      lastName,
      locationId,
      email,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateBasicInfo() {
  const query = useMutation(
    ({ firstName, lastName, email, locationId, _id }: T_UserBasic) =>
      updateBasicInfo({
        firstName,
        lastName,
        email,
        locationId,
        _id,
      })
  )

  return query
}

export default useUpdateBasicInfo
