import { T_Job, T_Part } from "custom-validator"
import { API_URL_JOBS, API_URL_PARTS } from "../../helpers/constants"
import { useMutation } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function updateJob({
  _id,
  name,
  factoryId,
  locationId,
  userId,
  partId,
  drawingNumber,
  count,
  priorityStatus,
  status,
  isStock,
  dueDate,
}: T_Job) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_JOBS}/${_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name,
      factoryId,
      locationId,
      userId,
      partId,
      drawingNumber,
      count,
      priorityStatus,
      status,
      isStock,
      dueDate,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useUpdateJob() {
  const query = useMutation(
    ({
      _id,
      name,
      factoryId,
      locationId,
      userId,
      partId,
      drawingNumber,
      count,
      priorityStatus,
      status,
      isStock,
      dueDate,
    }: T_Job) =>
      updateJob({
        _id,
        name,
        factoryId,
        locationId,
        userId,
        partId,
        drawingNumber,
        count,
        priorityStatus,
        status,
        isStock,
        dueDate,
      })
  )

  return query
}

export default useUpdateJob
