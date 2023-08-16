import { T_Location } from "custom-validator"
import { API_URL_LOCATIONS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateLocation({
  _id,
  name,
  productionTime,
  timeZone,
}: T_Location) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_LOCATIONS}/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      productionTime,
      timeZone,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateLocation() {
  const query = useMutation(
    ({ name, productionTime, timeZone, _id }: T_Location) =>
      updateLocation({
        name,
        productionTime,
        timeZone,
        _id,
      })
  )

  return query
}

export default useUpdateLocation
