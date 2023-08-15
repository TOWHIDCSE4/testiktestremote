import React, { Dispatch, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import Image from "next/image"

const ModalMediaList = ({
  files,
  isLoading,
}: {
  files: string[]
  isLoading: boolean
}) => {
  const filesArray = files?.map((filename) => ({ name: filename }))
  const [fileName, setFileName] = useState("")
  return (
    <div className="flex-1">
      <div className="w-full">
        <div
          className={`text-gray-400 justify-center text-sm border-2 border-gray-300 text-center rounded-md ${
            fileName ? "min-h-fit" : "h-[250px]"
          } p-5`}
        >
          {fileName ? (
            <div className="mx-auto">
              <Image src={fileName} alt="logo" width={200} height={100} />
            </div>
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
          {filesArray?.length > 0 ? (
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
          ) : (
            <div className="col-span-3 text-sm font-light text-gray-400 mt-1">
              No Media
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModalMediaList
