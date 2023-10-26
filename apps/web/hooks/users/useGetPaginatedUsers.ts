import { API_URL_USERS, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_User, T_UserRole } from "custom-validator"
import { T_UserStatus } from "custom-validator/ZUser"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import useProfile from "./useProfile"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_User[]
}

export async function getAllUsers({
  page,
  role,
  locationId,
  status,
  name,
  excludeUser,
}: {
  page: number
  role: T_UserRole | null
  locationId: string
  status: T_UserStatus | null
  name: string
  excludeUser: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_USERS}/paginated?page=${page}&role=${role}&locationId=${locationId}&status=${status}&name=${name}&excludeUser=${excludeUser}`,
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

function usePaginatedUsers(
  queryStatus: T_UserStatus | null,
  queryRole: T_UserRole
) {
  const [page, setPage] = useState(1)
  const [name, setName] = useState("")
  const { data: userProfile } = useProfile()
  const [locationId, setLocationId] = useState("")
  const [role, setRole] = useState<T_UserRole | null>(queryRole)
  const [status, setStatus] = useState<T_UserStatus | null>(queryStatus)
  const query = useQuery(
    ["paginated-users", page, role, locationId, status, name],
    () =>
      getAllUsers({
        page,
        role,
        locationId,
        status,
        name,
        excludeUser: userProfile?.item?._id as string,
      }),
    {
      staleTime: THREE_MINUTES,
      refetchOnWindowFocus: false,
      enabled: !!page && !!userProfile?.item?._id,
    }
  )
  useEffect(() => {
    if (page && (role || status || locationId || name)) {
      query.refetch()
    }
  }, [page, role, status, locationId, name])

  return {
    ...query,
    page,
    setPage,
    role,
    setRole,
    setLocationId,
    setStatus,
    setName,
  }
}
export default usePaginatedUsers
