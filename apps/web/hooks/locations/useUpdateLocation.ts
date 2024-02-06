import { T_Location } from "custom-validator"
import { API_URL_LOCATIONS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

type T_LocationProductionTime = {
  _id: string
  productionTime: number
}

export async function updateLocation({
  _id,
  productionTime,
}: T_LocationProductionTime) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_LOCATIONS}/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      productionTime,
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
    ({ productionTime, _id }: T_LocationProductionTime) =>
      updateLocation({
        productionTime,
        _id,
      })
  )

  return query
}

export default useUpdateLocation
