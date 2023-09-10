import React, { Dispatch } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import toast from "react-hot-toast"

const MultipleImageUpload = ({
  files,
  setFiles,
  isLoading,
}: {
  files: FileWithPath[]
  setFiles: Dispatch<FileWithPath[]>
  isLoading: boolean
}) => {
  const { getRootProps, getInputProps, isFocused } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "video/mp4": [],
      "video/mpeg": [],
      "video/webm": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles([...acceptedFiles])
    },
    onDropRejected: () => {
      toast.error("Only images and videos are allowed")
    },
    disabled: isLoading,
  })
  const removeFile = (index: number) => {
    const acceptedFilesCopy = [...files]
    let updated: FileWithPath[] = []
    if (acceptedFilesCopy.length > 1) {
      updated = acceptedFilesCopy.splice(index, 1)
    } else {
      updated = []
    }
    setFiles([...updated])
  }
  return (
    <section className="my-4">
      <label
        htmlFor="file-upload"
        className="uppercase font-semibold text-gray-800"
      >
        Assign Photos And Video Previews
      </label>
      <div {...getRootProps()} className={`${isLoading && "opacity-70"}`}>
        <input {...getInputProps()} />
        <div
          className={`text-gray-400 text-sm border-2 border-gray-300 border-dashed text-center p-5 rounded mt-2 cursor-pointer ${
            !isLoading && "hover:bg-gray-100"
          } ${isFocused && "bg-gray-100"} transition`}
        >
          Drop files here or click to upload
        </div>
        <em className="text-xs mt-1 text-gray-600">
          photos will be resized under 1mb and videos compressed to 1min at 720p
        </em>
      </div>
      <aside>
        <div
          className={`border-2 border-gray-300 py-2 px-3 mt-4 rounded-md ${
            isLoading && "opacity-70"
          }`}
        >
          <div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2 text-xs text-gray-600">File Name</div>
              <div className="text-xs text-gray-600">File Type</div>
            </div>
            {files.length > 0 ? (
              <div
                className={`grid grid-cols-4 gap-x-3 mt-1 font-semibold text-sm`}
              >
                {files.map((file: FileWithPath, index: number) => {
                  return (
                    <>
                      <div className="truncate col-span-2 text-gray-900">
                        {file.name}
                      </div>
                      <div className="text-gray-900">{file.type}</div>
                      <div
                        className={`text-gray-900 underline ${
                          !isLoading && "hover:text-red-600"
                        } cursor-pointer transition`}
                        onClick={() => !isLoading && removeFile(index)}
                      >
                        Remove
                      </div>
                    </>
                  )
                })}
              </div>
            ) : (
              <div className="col-span-3 text-sm font-light text-gray-400 mt-1">
                No Media Previews
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  )
}

export default MultipleImageUpload
