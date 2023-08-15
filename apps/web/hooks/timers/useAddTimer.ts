import { API_URL_TIMER } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_Timer } from "custom-validator"
import Cookies from "js-cookie"

export async function addTimer({
  factoryId,
  machineId,
  partId,
  locationId,
}: T_Timer) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}`, {
    method: "POST",
    body: JSON.stringify({
      factoryId,
      machineId,
      partId,
      locationId,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddTimer() {
  const query = useMutation(
    ({ factoryId, machineId, partId, locationId }: T_Timer) =>
      addTimer({
        factoryId,
        machineId,
        partId,
        locationId,
      })
  )

  return query
}

export default useAddTimer
