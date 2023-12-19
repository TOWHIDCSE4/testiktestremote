import {
  API_URL_USERS,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_User } from "custom-validator"
import Cookies from "js-cookie"
import { isEmpty, pickBy } from "lodash/fp"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_User[]
}

interface UserFilter {
  role: string
  factoryId: string
  machineClassId: string
}

export async function getUsers(filter: Partial<UserFilter>) {
  const token = Cookies.get("tfl")
  const nonEmptyFilter = pickBy((v) => !isEmpty(v), filter)
  const searchParam = new URLSearchParams(nonEmptyFilter)

  const res = await fetch(`${API_URL_USERS}?${searchParam.toString()}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useUsers(filter: Partial<UserFilter> = {}) {
  const nonEmptyFilter = pickBy((v) => !isEmpty(v), filter)
  const searchParam = new URLSearchParams(nonEmptyFilter)
  const query = useQuery(
    ["users", searchParam.toString()],
    () => getUsers(filter),
    {
      refetchOnWindowFocus: false,
    }
  )
  return query
}
export default useUsers
