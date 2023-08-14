import { I_PartUpdate } from "../../types/global"
import { API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"

export async function updatePart(
  {
    id,
    name,
    factoryId,
    machineClassId,
    pounds,
    time,
    finishGoodWeight,
    cageWeightActual,
    cageWeightScrap,
    locationId,
  }: I_PartUpdate,
  token: string
) {
  const res = await fetch(`${API_URL_PARTS}/${id}`, {
    method: "PATCH",
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

function useUpdatePart(token: string) {
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
      id,
    }: I_PartUpdate) =>
      updatePart(
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
          id,
        },
        token
      )
  )

  return query
}

export default useUpdatePart
