import { API_URL_MACHINE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_Machine } from "custom-validator"
import Cookies from "js-cookie"

export async function addMachine(props: T_Machine) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_MACHINE}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddMachine() {
  const query = useMutation((props: T_Machine) => addMachine(props))
  return query
}

export default useAddMachine
