import { useMutation } from "@tanstack/react-query"
import { API_URL_UPLOAD } from "../../helpers/constants"
import { FileWithPath } from "react-dropzone"

export async function uploadMedia(file: File) {
  const formData = new FormData()
  formData.append("file-name", file)
  const res = await fetch(`${API_URL_UPLOAD}`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${process.env.MEDIA_KEY}`,
    },
  })
  return await res.json()
}

function useUploadMediaFile() {
  const query = useMutation((file: FileWithPath) => uploadMedia(file))
  return query
}

export default useUploadMediaFile
