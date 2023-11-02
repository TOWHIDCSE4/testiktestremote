// import {
//   API_URL_JOBS,
//   REFETCH_ACTIVATED,
//   THREE_MINUTES,
// } from "../../helpers/constants"
// import { QueryClient,  useQuery } from "@tanstack/react-query"
// import { T_BackendResponse, T_Job, T_Part } from "custom-validator"
// import Cookies from "js-cookie"
// import { useEffect, useState } from "react"

// const queryClient = new QueryClient();

// type T_DBReturn = Omit<T_BackendResponse, "items"> & {
//   items: T_Job[]
// }

// export async function getAllParts({
//   page,
//   locationId,
//   status,
//   search,
//   jobType,
//   machineClass,
// }: {
//   page: number
//   locationId: string
//   status?: string
//   search?: string
//   jobType?: string
//   machineClass: string []
// }) {
//   console.log("🚀 ~ file: usePaginatedJobs.ts:31 ~ machineClass:", machineClass)
//   //@ts-expect-error
//   const machineClassIdQueryString = new URLSearchParams({
//     machineClass: machineClass,
//   }).toString()
//   const token = Cookies.get("tfl")
//   // console.log(search, "Job" , jobType)
//   const res = await fetch(
//     `${API_URL_JOBS}/paginated?page=${page}&locationId=${locationId}&status=${status}&search=${search}&selectedjob=${jobType}&${machineClassIdQueryString}`,
//     {
//       method: "GET",
//       headers: {
//         "content-type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   )
//   return (await res.json()) as T_DBReturn
// }

// function usePaginatedJobs() {
//   const [page, setPage] = useState(1)
//   const [locationId, setLocationId] = useState("")
//   const [status, setStatus] = useState("")
//   const [search, setSearch] = useState("")
//   const [jobType, setJobType] = useState("")
//   const [machineClass, setMachineClass] = useState<string []>([])

//   const query = useQuery(
//     ["jobs", page, locationId, status, search, jobType, ...machineClass],
//     () => getAllParts({ page, locationId, status, search, jobType, machineClass}),
//     {
//       refetchOnWindowFocus: false,
//       enabled: !!locationId && !!page,
//       refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
//     }
//   )

//   useEffect(() => {
//     console.log("🚀 ~ file: usePaginatedJobs.ts:71 ~ useEffect ~ machineClass:", machineClass)
//     if (locationId && page && search && jobType && machineClass) {
//       queryClient.invalidateQueries(['jobs'])
//     }
//   }, [page, locationId, search, jobType,machineClass])

//   return {
//     ...query,
//     page,
//     setPage,
//     locationId,
//     setLocationId,
//     status,
//     setStatus,
//     machineClass,
//     setMachineClass,
//     search,
//     setSearch,
//     jobType,
//     setJobType,
//   }
// }
// export default usePaginatedJobs

import {
  API_URL_JOBS,
  REFETCH_ACTIVATED,
  THREE_MINUTES,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Job, T_Part } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Job[]
}

export async function getAllParts({
  page,
  locationId,
  status,
  search,
  jobType,
  machineClassId, // Add machineClassId as a parameter
}: {
  page: number
  locationId: string
  status?: string
  search?: string
  jobType?: string
  machineClassId: string[] // Define machineClassId as an array of strings
}) {
  //@ts-expect-error
  const machineClassIdQueryString = new URLSearchParams({
    machineClassId: machineClassId,
  }).toString()
  console.log("Macxine", machineClassIdQueryString)
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_JOBS}/paginated?page=${page}&locationId=${locationId}&status=${status}&search=${search}&selectedjob=${jobType}&${machineClassIdQueryString}`, // Pass machineClassId to the API as a comma-separated string
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

function usePaginatedJobs() {
  const [page, setPage] = useState(1)
  const [locationId, setLocationId] = useState("")
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [jobType, setJobType] = useState("")
  const [machineClassId, setMachineClassId] = useState<string[]>([]) // Define machineClassId as an array of strings
  const query = useQuery(
    ["jobs", page, locationId, status, search, jobType, machineClassId], // Include machineClassId in the query key
    () =>
      getAllParts({
        page,
        locationId,
        status,
        search,
        jobType,
        machineClassId, // Pass machineClassId to the getAllParts function
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!page,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )
  useEffect(() => {
    // console.log("Macxine", machineClassId)
    console.log(
      "🚀 ~ file: usePaginatedJobs.ts:167 ~ useEffect ~ machineClassId:",
      machineClassId
    )
    if ((locationId && page) || search || jobType || machineClassId) {
      query.refetch()
    }
  }, [page, locationId, search, jobType, machineClassId]) // Include machineClassId in the dependencies

  return {
    ...query,
    page,
    setPage,
    locationId,
    setLocationId,
    status,
    setStatus,
    search,
    setSearch,
    jobType,
    setJobType,
    machineClassId,
    setMachineClassId,
  }
}
export default usePaginatedJobs
