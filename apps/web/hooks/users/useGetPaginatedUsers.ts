import { API_URL_USERS, THREE_MINUTES } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import {
  T_BackendResponse,
  T_Factory,
  T_MachineClass,
  T_User,
  T_UserRole,
} from "custom-validator"
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
  factories,
  machineClass,
  status,
  name,
  excludeUser,
}: {
  page: number
  locationId: string
  role: T_UserRole | null
  factories: string | null
  status: T_UserStatus | null
  machineClass: string | null
  excludeUser: string
  name: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_USERS}/paginated?page=${page}&role=${role}&locationId=${locationId}&status=${status}&name=${name}&excludeUser=${excludeUser}&factories=${factories}&machineClass=${machineClass}`,
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
  const [factories, setFactories] = useState<string | null>("")
  const [status, setStatus] = useState<T_UserStatus | null>(queryStatus)
  const [machineClass, setMachineClass] = useState<string | null>("")
  const query = useQuery(
    [
      "paginated-users",
      page,
      role,
      locationId,
      status,
      name,
      factories,
      machineClass,
    ],
    () =>
      getAllUsers({
        page,
        role,
        machineClass,
        locationId,
        factories,
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
    if (
      page &&
      (role || status || locationId || name || factories || machineClass)
    ) {
      query.refetch()
    }
  }, [page, role, status, locationId, name, factories, machineClass])

  return {
    ...query,
    page,
    role,
    status,
    setPage,
    setRole,
    setFactories,
    setLocationId,
    setMachineClass,
    setStatus,
    setName,
  }
}
export default usePaginatedUsers
