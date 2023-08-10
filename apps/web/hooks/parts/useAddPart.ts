import { I_Part, I_User } from "../../../web/types/global"
import { API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function addPart(
  token: string,
  {
    name,
    factoryId,
    machineClassId,
    pounds,
    time,
    finishGoodWeight,
    cageWeightActual,
    cageWeightScrap,
    locationId,
  }: I_Part
) {
  const res = await fetch(`${API_URL_PARTS}`, {
    method: "POST",
    body: JSON.stringify({
      name,
      factoryId,
      machineClassId,
      pounds,
      time,
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

function useAddPart(token: string) {
  const query = useMutation(
    ({
      name,
      factoryId,
      machineClassId,
      pounds,
      time,
      finishGoodWeight,
      cageWeightActual,
      cageWeightScrap,
      locationId,
    }: I_Part) =>
      addPart(token, {
        name,
        factoryId,
        machineClassId,
        pounds,
        time,
        finishGoodWeight,
        cageWeightActual,
        cageWeightScrap,
        locationId,
      })
  )

  return query
}

export default useAddPart
