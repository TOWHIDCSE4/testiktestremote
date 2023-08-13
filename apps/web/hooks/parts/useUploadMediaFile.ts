import { useMutation } from "@tanstack/react-query"
import { API_URL_UPLOAD } from "../../helpers/constants"

export async function uploadMedia(file: File) {
  const formData = new FormData()
  formData.append("file-name", file)
  const res = await fetch(`${API_URL_UPLOAD}`, {
    method: "POST",
    body: formData,
  })
  return await res.json()
}

function useUploadMediaFile() {
  const query = useMutation((file: File) => uploadMedia(file))
  return query
}

export default useUploadMediaFile
