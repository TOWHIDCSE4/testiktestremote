import React, { Dispatch, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import Image from "next/image"
import toast from "react-hot-toast"

const ModalMediaList = ({
  files,
  filesToUpload,
  setFilesToUpload,
  isLoading,
}: {
  files: string[]
  filesToUpload: (FileWithPath & { preview: string })[]
  setFilesToUpload: Dispatch<(FileWithPath & { preview: string })[]>
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
      setFilesToUpload(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
    onDropRejected: () => {
      toast.error("Only images and videos are allowed")
    },
    disabled: isLoading,
  })
  const filesArray = files?.map((filename) => ({ name: filename }))
  const [fileName, setFileName] = useState("")
  return (
    <div className="flex-1">
      <div className="w-full">
        <div
          className={`text-gray-400 justify-center text-sm border-2 border-gray-300 text-center rounded-md h-52`}
        >
          {fileName ? (
            <Image
              src={fileName}
              className="object-contain h-52 w-auto px-4 pt-4 pb-5 mx-auto"
              alt="logo"
              width={200}
              height={100}
            />
          ) : null}
        </div>
      </div>
      <div
        className={`border-2 border-gray-300 py-2 px-3 mt-2 rounded-md ${
          isLoading && "opacity-70"
        }`}
      >
        <div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 text-xs text-gray-600">File Name</div>
            <div className="col-span-2 text-xs text-gray-600">File Type</div>
          </div>
          {filesArray?.length > 0 && (
            <div
              className={`grid grid-cols-4 gap-x-3 mt-1 font-semibold text-sm`}
            >
              {filesArray.map((filename, index) => (
                <>
                  <div
                    key={index}
                    onClick={() => setFileName("/files/" + filename.name)}
                    className="truncate cursor-pointer hover:underline col-span-2 text-gray-900"
                  >
                    {filename.name as string}
                  </div>
                  <div className="truncate col-span-2 text-gray-900">
                    image/png
                  </div>
                </>
              ))}
            </div>
          )}
          {filesToUpload?.length > 0 && (
            <div
              className={`grid grid-cols-4 gap-x-3 mt-1 font-semibold text-sm`}
            >
              {filesToUpload.map((filename, index) => (
                <>
                  <div
                    key={index}
                    onClick={() => setFileName(filename.preview)}
                    className="truncate cursor-pointer hover:underline col-span-2 text-gray-900"
                  >
                    {filename.name as string}
                  </div>
                  <div className="truncate col-span-2 text-gray-900">
                    {filename.type}
                  </div>
                </>
              ))}
            </div>
          )}
          {filesArray?.length === 0 && filesToUpload?.length === 0 && (
            <div className="col-span-3 text-sm font-light text-gray-400 mt-1">
              No Media
            </div>
          )}
        </div>
      </div>
      <div {...getRootProps()} className={`${isLoading && "opacity-70"}`}>
        <input {...getInputProps()} />
        <div
          className={`text-gray-400 text-sm border-2 border-gray-300 border-dashed text-center p-5 rounded mt-2 cursor-pointer ${
            !isLoading && "hover:bg-gray-100"
          } ${isFocused && "bg-gray-100"} transition`}
        >
          Drop files here or click to upload new media
        </div>
        <em className="text-xs mt-1 text-gray-600">
          photos will be resized under 1mb and videos compressed to 1min at 720p
        </em>
      </div>
    </div>
  )
}

export default ModalMediaList
