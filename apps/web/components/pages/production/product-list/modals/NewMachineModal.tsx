import { Fragment, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Dialog, Transition } from "@headlessui/react"
import useFactories from "../../../../../hooks/factories/useFactories"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import MultipleImageUpload from "../../../../MultipleImageUpload"
import { FileWithPath } from "react-dropzone"
import { useForm } from "react-hook-form"
import {
  T_BackendResponse,
  T_Factory,
  T_Machine,
  T_MachineClass,
} from "custom-validator"
import toast from "react-hot-toast"
import useUploadMediaFiles from "../../../../../hooks/media/useUploadMediaFiles"
import useAddMachine from "../../../../../hooks/machines/useAddMachine"

interface NewModalProps {
  isOpen: boolean
  locationState: string
  locationId: string | null
  onClose: () => void
}

const NewMachineModal = ({
  isOpen,
  locationState,
  locationId,
  onClose,
}: NewModalProps) => {
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const { register, handleSubmit, setValue, reset } = useForm<T_Machine>()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const { mutate: uploadMediaFiles, isLoading: isUploadMediaFilesLoading } =
    useUploadMediaFiles()
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const { mutate, isLoading: isAddMachineLoading } = useAddMachine()

  const [files, setFiles] = useState<FileWithPath[]>([])
  const [selectedFactory, setSelectedFactory] = useState("")

  const onSubmit = (data: T_Machine) => {
    const callBackReq = {
      onSuccess: (returnData: T_BackendResponse) => {
        if (!returnData.error) {
          if (returnData.item) {
            queryClient.invalidateQueries({
              queryKey: ["machines"],
            })
            queryClient.invalidateQueries({
              queryKey: ["machine-location-counts"],
            })
            onClose()
            reset()
            setSelectedFactory("")
            setFiles([])
            toast.success("New machine was added")
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
                    <h3 className="text-gray-800 font-semibold text-2xl">{`${locationState} > New Machine`}</h3>
                    <div className="md:flex items-center mt-6">
                      <label
                        htmlFor="name-id"
                        className="uppercase font-semibold text-gray-800 md:w-[20%]"
                      >
                        Name ID
                      </label>
                      <input
                        type="text"
                        id="nameId"
                        required
                        disabled={
                          isAddMachineLoading || isUploadMediaFilesLoading
                        }
                        className={`block mt-2 md:mt-0 w-full md:w-[80%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        placeholder="Machine"
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
                          isAddMachineLoading ||
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
                        {factories?.items?.map(
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
                          isAddMachineLoading
                        }
                        defaultValue="Select Machine Class"
                        {...register("machineClassId", { required: true })}
                      >
                        <option value="">Select Machine Class</option>
                        {machineClasses?.items?.map(
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
                      Machine/Process Details:
                    </h6>
                    <div className="mt-4">
                      <label
                        htmlFor="description"
                        className="uppercase font-semibold text-gray-800"
                      >
                        Machine Or Process Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          required
                          id="description"
                          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6`}
                          placeholder="Details"
                          defaultValue={""}
                          {...register("description", { required: true })}
                        />
                      </div>
                    </div>
                    <MultipleImageUpload
                      files={files}
                      setFiles={setFiles}
                      isLoading={false}
                    />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      disabled={
                        isAddMachineLoading || isUploadMediaFilesLoading
                      }
                      className="uppercase inline-flex w-full items-center justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3  disabled:opacity-70 sm:w-auto"
                    >
                      {isAddMachineLoading || isUploadMediaFilesLoading ? (
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
                      disabled={
                        isAddMachineLoading || isUploadMediaFilesLoading
                      }
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
export default NewMachineModal
