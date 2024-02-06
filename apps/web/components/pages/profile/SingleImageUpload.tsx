import { ArrowUturnLeftIcon } from "@heroicons/react/20/solid"
import React, { Dispatch } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import toast from "react-hot-toast"

const SingleImageUpload = ({
  file,
  setFile,
  isLoading,
}: {
  file: (FileWithPath & { preview: string }) | null
  setFile: Dispatch<(FileWithPath & { preview: string }) | null>
  isLoading: boolean
}) => {
  const { getRootProps, getInputProps, isFocused } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
    },
    onDrop: (acceptedFiles) => {
      setFile(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      )
    },
    onDropRejected: () => {
      toast.error("Only images and videos are allowed")
    },
    disabled: isLoading,
  })
  return (
    <section className="w-full">
      <div {...getRootProps()} className={`${isLoading && "opacity-70"}`}>
        <input {...getInputProps()} />
        <div
          className={`text-gray-400 text-sm border-2 border-gray-300 border-dashed text-center p-3 rounded cursor-pointer ${
            !isLoading && "hover:bg-gray-100"
          } ${isFocused && "bg-gray-100"} transition`}
        >
          Drop image here or click to upload
        </div>
      </div>
      {file && (
        <button
          className="flex items-center gap-1 mt-1 group hover:text-blue-600"
          onClick={() => setFile(null)}
        >
          <ArrowUturnLeftIcon className="h-4 w-4 text-gray-700 group-hover:text-blue-600" />
          Undo
        </button>
      )}
    </section>
  )
}

export default SingleImageUpload
