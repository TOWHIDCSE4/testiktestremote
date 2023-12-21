import { API_URL_PROFILE_LOOKUP } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_Location } from "custom-validator"
import Cookies from "js-cookie"
import { T_SelectItem } from "../../components/pages/production/system-check/CustomSelect"

interface I_Filters {
  locations: T_SelectItem[] | undefined
  machineClasses: T_SelectItem[] | undefined
  machines: T_SelectItem[] | undefined
  parts: T_SelectItem[] | undefined
  startDate: Date
  endDate: Date
  includeCycles: boolean | undefined
}

export async function updaterFn(props: I_Filters) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_PROFILE_LOOKUP}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddProductionLookupFilter() {
  const query = useMutation((props: I_Filters) => updaterFn(props))
  return query
}

export default useAddProductionLookupFilter
