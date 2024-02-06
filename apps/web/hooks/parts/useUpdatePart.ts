import { T_Part } from "custom-validator"
import { API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updatePart(props: T_Part) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PARTS}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdatePart() {
  const query = useMutation((props: T_Part) => updatePart(props))
  return query
}

export default useUpdatePart
