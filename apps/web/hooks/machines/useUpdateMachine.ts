import { T_Machine } from "custom-validator"
import { API_URL_MACHINE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateMachine(props: T_Machine) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateMachine() {
  const query = useMutation((props: T_Machine) => updateMachine(props))
  return query
}

export default useUpdateMachine
