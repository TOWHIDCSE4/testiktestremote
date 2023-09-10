import { API_URL_USERS, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_User } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_User[]
}

export async function getAllUsers({
  page,
  role,
}: {
  page: number
  role: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_USERS}/paginated?page=${page}&role=${role}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return (await res.json()) as T_DBReturn
}

function usePaginatedUsers() {
  const [page, setPage] = useState(1)
  const [role, setRole] = useState("")
  const query = useQuery(
    ["parts", page, role],
    () => getAllUsers({ page, role }),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!role && !!page,
    }
  )
  useEffect(() => {
    if (role && page) {
      query.refetch()
    }
  }, [page, role])

  return {
    ...query,
    page,
    setPage,
    role,
    setRole,
  }
}
export default usePaginatedUsers
