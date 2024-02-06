import { T_Job, T_Part } from "custom-validator"
import { API_URL_JOBS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateJob(props: T_Job) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_JOBS}/${props._id}`, {
    method: "PATCH",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateJob() {
  const query = useMutation((props: T_Job) => updateJob(props))
  return query
}

export default useUpdateJob
