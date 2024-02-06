import { useMutation } from "@tanstack/react-query"
import { T_User } from "custom-validator"
import Cookies from "js-cookie"
import { API_URL_USERS } from "../../helpers/constants"

type Props = T_User & {
  defaultSettings: {
    viewMode: string
    locations: string[]
    machineClasses: string[]
  }
}

export async function updaterFn(props: Props) {
  console.log("Props", props)

  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateUserProductionEye() {
  const query = useMutation({
    mutationFn: (props: Props) => updaterFn(props),
    onError: (error) => console.log("error", error),
    onSuccess: (data) => console.log("DATA_FROM_SUCCESS__", data),
  })
  return query
}

export default useUpdateUserProductionEye
