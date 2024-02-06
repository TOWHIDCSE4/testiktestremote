import { useMutation } from "@tanstack/react-query"
import { uploadMedia } from "./useUploadMediaFile"

function useUploadMediaFiles() {
  const query = useMutation(async (files: File[]) => {
    const requests = await Promise.all(files.map((file) => uploadMedia(file)))
    return requests
  })
  return query
}

export default useUploadMediaFiles
