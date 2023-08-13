import { API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_Part } from "custom-validator"
import Cookies from "js-cookie"

export async function addPart({
  name,
  factoryId,
  machineClassId,
  pounds,
  time,
  finishGoodWeight,
  cageWeightActual,
  cageWeightScrap,
  locationId,
  files,
}: T_Part) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}`, {
    method: "POST",
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

function useAddPart() {
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
    }: T_Part) =>
      addPart({
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
      })
  )

  return query
}

export default useAddPart
