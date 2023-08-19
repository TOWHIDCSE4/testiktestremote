import { Fragment, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Dialog, Transition } from "@headlessui/react"
import useFactories from "../../../../../hooks/factories/useFactories"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import {
  T_BackendResponse,
  T_Factory,
  T_MachineClass,
  T_Part,
} from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useAddPart from "../../../../../hooks/parts/useAddPart"
import MultipleImageUpload from "../../../../MultipleImageUpload"
import { FileWithPath } from "react-dropzone"
import useUploadMediaFiles from "../../../../../hooks/media/useUploadMediaFiles"

interface NewModalProps {
  isOpen: boolean
  locationState: string | null
  locationId: string | null
  onClose: () => void
}

const NewPartModal = ({
  isOpen,
  locationState,
  locationId,
  onClose,
}: NewModalProps) => {
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const [files, setFiles] = useState<FileWithPath[]>([])
  const { register, handleSubmit, setValue, reset } = useForm<T_Part>()
  const { mutate: uploadMediaFiles, isLoading: isUploadMediaFilesLoading } =
    useUploadMediaFiles()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const { mutate, isLoading: isAddPartLoading } = useAddPart()

  const [selectedFactory, setSelectedFactory] = useState("")

  const onSubmit = (data: T_Part) => {
    const callBackReq = {
      onSuccess: (returnData: T_BackendResponse) => {
        if (!returnData.error) {
          if (returnData.item) {
            queryClient.invalidateQueries({
              queryKey: ["parts"],
            })
            queryClient.invalidateQueries({
              queryKey: ["part-location-counts"],
            })
            onClose()
            reset()
            setSelectedFactory("")
            setFiles([])
            toast.success("New part was added")
          }
        } else {
          toast.error(returnData.message as string)
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    const uploadFilesCallBackReq = {
      onSuccess: (returnData: T_BackendResponse[]) => {
        const imagesUploadStatus = returnData.map((item) => {
          return item.error
        })
        if (imagesUploadStatus.some((status) => status)) {
          toast.error("Some media files failed to upload")
        }
        const uploadedNames = returnData.map((item) => {
          return item.item?.name
        })
        mutate(
          {
            ...data,
            locationId: locationId ? locationId : "",
            files: uploadedNames,
          },
          callBackReq
        )
      },
      onError: (err: any) => {
        toast.error(String(err))
        mutate(
          { ...data, locationId: locationId ? locationId : "", files: [] },
          callBackReq
        )
      },
    }
    if (files.length > 0) {
      uploadMediaFiles(files, uploadFilesCallBackReq)
    } else {
      mutate(
        { ...data, locationId: locationId ? locationId : "", files: [] },
        callBackReq
      )
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className={`fixed inset-0 z-10 overflow-y-auto`}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-gray-800 font-semibold text-2xl">
                      {`${locationState} > New Part`}
                    </h3>
                    <div className="md:flex items-center mt-6">
                      <label
                        htmlFor="nameId"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Name ID
                      </label>
                      <input
                        type="text"
                        id="nameId"
                        required
                        disabled={isAddPartLoading || isUploadMediaFilesLoading}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        placeholder="Part"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="factory"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Factory
                      </label>
                      <select
                        disabled={
                          isFactoriesLoading ||
                          isAddPartLoading ||
                          isUploadMediaFilesLoading
                        }
                        id="factory"
                        required
                        {...register("factoryId", { required: true })}
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        onChange={(e) => {
                          setSelectedFactory(e.target.value)
                          setSelectedFactoryId(e.target.value)
                          setValue("machineClassId", "")
                        }}
                      >
                        <option value="">Select Factory</option>
                        {factories?.items.map(
                          (item: T_Factory, index: number) => {
                            return (
                              <option key={index} value={item._id as string}>
                                {item.name}
                              </option>
                            )
                          }
                        )}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="machineClass"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Machine Class
                      </label>
                      <select
                        id="machineClass"
                        required
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        disabled={
                          selectedFactory === "" ||
                          isMachineClassesRefetching ||
                          isMachineClassesLoading ||
                          isAddPartLoading
                        }
                        defaultValue="Select Machine Class"
                        {...register("machineClassId", { required: true })}
                      >
                        <option value="">Select Machine Class</option>
                        {machineClasses?.items.map(
                          (machine: T_MachineClass, index: number) => {
                            return (
                              <option key={index} value={machine._id as string}>
                                {machine.name}
                              </option>
                            )
                          }
                        )}
                      </select>
                    </div>
                    <h6 className="uppercase font-semibold text-gray-400 mt-4">
                      New Part Details:
                    </h6>
                    <div className="md:flex mt-4 md:space-x-8">
                      <div className="md:w-2/4">
                        <label
                          htmlFor="weight"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Weight In LBS
                        </label>
                        <input
                          type="number"
                          id="weight"
                          required
                          disabled={
                            isAddPartLoading || isUploadMediaFilesLoading
                          }
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                          placeholder="Pounds"
                          {...register("pounds", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div className="md:w-2/4 mt-4 md:mt-0">
                        <label
                          htmlFor="time"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Time In Seconds
                        </label>
                        <input
                          type="number"
                          id="time"
                          required
                          disabled={
                            isAddPartLoading || isUploadMediaFilesLoading
                          }
                          className={`mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                          placeholder="Avg Time"
                          {...register("time", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                    <MultipleImageUpload
                      files={files}
                      setFiles={setFiles}
                      isLoading={isAddPartLoading || isUploadMediaFilesLoading}
                    />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      disabled={isAddPartLoading || isUploadMediaFilesLoading}
                      className="uppercase inline-flex w-full items-center justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3  disabled:opacity-70 sm:w-auto"
                    >
                      {isAddPartLoading || isUploadMediaFilesLoading ? (
                        <div
                          className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"
                          role="status"
                          aria-label="loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Add"
                      )}
                    </button>
                    <button
                      type="button"
                      className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                      disabled={isAddPartLoading || isUploadMediaFilesLoading}
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default NewPartModal
