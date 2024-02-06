import { API_URL_JOBS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import { T_Job } from "custom-validator"
import Cookies from "js-cookie"

export async function addJob(props: T_Job) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_JOBS}`, {
    method: "POST",
    body: JSON.stringify(props),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useAddJob() {
  const query = useMutation((props: T_Job) => addJob(props))
  return query
}

export default useAddJob
