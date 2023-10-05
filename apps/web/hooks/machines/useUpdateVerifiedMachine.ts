import { ONE_DAY, API_URL_VERIFIED_MACHINE } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateVerifiedMachine({ machineId }) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_VERIFIED_MACHINE}/${machineId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useVerifiedMachine() {
  const mutation = useMutation((machineId) =>
    updateVerifiedMachine({ machineId })
  )
  return mutation
}
export default useVerifiedMachine
