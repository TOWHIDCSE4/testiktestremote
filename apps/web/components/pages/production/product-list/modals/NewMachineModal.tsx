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
import { Bebas_Neue } from "next/font/google"
import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClasses"
const bebas_neueu = Bebas_Neue({ weight: "400", subsets: ["latin"] })

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
  // const {
  //   data: machineClasses,
  //   isLoading: isMachineClassesLoading,
  //   isRefetching: isMachineClassesRefetching,
  //   setSelectedFactoryId,
  // } = useFactoryMachineClasses()
  const {
    data: machineClasses,
    isLoading: isMachineClassesLoading,
    isRefetching: isMachineClassesRefetching,
    // setSelectedFactoryId,
  } = useMachineClasses()
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
        className="relative z-50"
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" />
        </Transition.Child>

        <div className={`fixed inset-0 z-50 overflow-y-auto`}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[34rem]">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex items-center bg-red-700 text-white uppercase rounded-t-lg justify-between h-28 m-[0.2rem] p-8 border-dark-blue border-b-8">
                    <h3 className="text-lg tracking-wider">
                      New Machine/Process
                    </h3>
                    <h2
                      className={`font-bold text-7xl tracking-widest mt-2 ${bebas_neueu.className}`}
                    >
                      {locationState}
                    </h2>
                  </div>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b-4">
                    <div className="md:flex items-center">
                      <label
                        htmlFor="name-id"
                        className="uppercase font-semibold text-lg text-gray-800 md:w-[35%] text-right mr-3"
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
                        className={`block mt-2 md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        placeholder="Machine"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <div className="md:flex items-center mt-4">
                      <label
                        htmlFor="factory"
                        className="uppercase font-semibold text-lg text-gray-800 md:w-[35%] text-right mr-3"
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
                        className={`block mt-2 md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        onChange={(e) => {
                          setSelectedFactory(e.target.value)
                          // setSelectedFactoryId(e.target.value)
                          setValue("machineClassId", "")
                        }}
                      >
                        <option value="">Factory</option>
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
                        className="uppercase font-semibold text-lg text-gray-800 md:w-[35%] text-right mr-3"
                      >
                        Machine Class
                      </label>
                      <select
                        id="machineClass"
                        required
                        className={`block mt-2 md:mt-0 w-full md:w-[60%] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        disabled={
                          selectedFactory === "" ||
                          isMachineClassesRefetching ||
                          isMachineClassesLoading ||
                          isAddMachineLoading
                        }
                        defaultValue="Machine Class"
                        {...register("machineClassId", { required: true })}
                      >
                        <option value="">Machine Class</option>
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
                    <div className="flex w-full">
                      <h6 className="uppercase font-semibold text-gray-400 mt-4 ml-5 w-2/3 text-xl">
                        Machine/Process Details:
                      </h6>
                      <div className="border-gray-400 border-b-4 w-1/3 h-8 mr-2"></div>
                    </div>
                    <div className="md:flex mt-4 md:space-x-8 justify-around p-4">
                      <div className="md:w-5/6 m-auto text-center">
                        <label
                          htmlFor="description"
                          className="uppercase font-semibold text-gray-800"
                        >
                          Machine Or Process Description
                        </label>
                        <div className="mt-2">
                          <textarea
                            rows={1}
                            required
                            id="description"
                            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6`}
                            placeholder="Details"
                            defaultValue={""}
                            {...register("description", { required: true })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:w-5/6 m-auto text-center">
                      <MultipleImageUpload
                        files={files}
                        setFiles={setFiles}
                        isLoading={false}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      disabled={
                        isAddMachineLoading || isUploadMediaFilesLoading
                      }
                      className="uppercase inline-flex w-full h-6 items-center justify-center rounded-md bg-red-700 px-9 text-sm font-semibold text-white shadow-sm hover:bg-red-600 sm:ml-3  disabled:opacity-70 sm:w-auto"
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
                      className="uppercase inline-flex w-full h-6 items-center justify-center rounded-md bg-gray-400 px-6 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto disabled:opacity-70"
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
