import {
  API_URL_MACHINE,
  API_URL_USERS,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: string
  itemCount: number
}

export async function getUserRoleCount(role: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_USERS}/role-count/${role}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useGetUserRoleCount() {
  const [roles, setRoles] = useState<string[]>([])

  const query = useQuery(
    ["user-role-count", roles],
    () => Promise.all(roles.map((role) => getUserRoleCount(role))),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!roles,
    }
  )

  useEffect(() => {
    if (roles) {
      query.refetch()
    }
  }, [roles])

  return { ...query, setRoles }
}
export default useGetUserRoleCount
