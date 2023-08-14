import { T_Part } from "custom-validator"
import { API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updatePart({
  _id,
  name,
  factoryId,
  machineClassId,
  pounds,
  time,
  files,
  finishGoodWeight,
  cageWeightActual,
  cageWeightScrap,
  locationId,
}: T_Part) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      factoryId,
      machineClassId,
      pounds,
      time,
      files,
      finishGoodWeight,
      cageWeightActual,
      cageWeightScrap,
      locationId,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdatePart() {
  const query = useMutation(
    ({
      name,
      factoryId,
      machineClassId,
      pounds,
      time,
      files,
      finishGoodWeight,
      cageWeightActual,
      cageWeightScrap,
      locationId,
      _id,
    }: T_Part) =>
      updatePart({
        name,
        factoryId,
        machineClassId,
        pounds,
        time,
        files,
        finishGoodWeight,
        cageWeightActual,
        cageWeightScrap,
        locationId,
        _id,
      })
  )

  return query
}

export default useUpdatePart
