"use client"
import { Fragment, useRef, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import useFactories from "../../../../../hooks/factories/useFactories"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import {
  T_BackendResponse,
  T_Factory,
  T_Machine,
  T_MachineClass,
} from "custom-validator"
import toast from "react-hot-toast"
import ModalMediaList from "./ModalMediaList"
import useGetMachine from "../../../../../hooks/machines/useGetMachine"
import useUpdateMachine from "../../../../../hooks/machines/useUpdateMachine"
import { FileWithPath } from "react-dropzone"
import useUploadMediaFiles from "../../../../../hooks/media/useUploadMediaFiles"
import useVerifiedMachine from "../../../../../hooks/machines/useUpdateVerifiedMachine"
import Cookies from "js-cookie"
import {
  API_URL_VERIFIED_MACHINE,
  USER_ROLES,
} from "../../../../../helpers/constants"
import useStoreSession from "../../../../../store/useStoreSession"

interface DetailsModalProps {
  isOpen: boolean
  locationState: string
  onClose: () => void
  id?: string
}

const PRODUCTION_ADMIN_ROLES = [USER_ROLES.Administrator, USER_ROLES.Production]

const MachineDetailsModal = ({
  isOpen,
  locationState,
  onClose,
  id,
}: DetailsModalProps) => {
  const { mutate: uploadMediaFiles, isLoading: isUploadMediaFilesLoading } =
    useUploadMediaFiles()
  const [filesToUpload, setFilesToUpload] = useState<
    (FileWithPath & { preview: string })[]
  >([])
  const queryClient = useQueryClient()
  const closeButtonRef = useRef(null)
  const storeSession = useStoreSession((state) => state)
  const {
    data: machineDetails,
    isLoading: isMachineDetailsLoading,
    refetch: refetchMachine,
  } = useGetMachine(id)
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const {
    data: machineClasses,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
  } = useFactoryMachineClasses()
  const { mutate, isLoading: isUpdateMachineLoading } = useUpdateMachine()
  // const { mutate: toVerify, isLoading: isVerifyLoading } =
  //   useVerifiedMachine(id)

  console.log(
    "🚀 ~ file: MachineDetailsModal.tsx:65 ~ machineDetails?.item?.verified:",
    machineDetails?.item?.verified
  )
  const [isVerifiedMachine, setIsVerifiedMachine] = useState(
    machineDetails?.item?.verified ? true : false
  )

  const handleButton = async () => {
    const token = Cookies.get("tfl")
    const res = await fetch(`${API_URL_VERIFIED_MACHINE}/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    await res.json()
    setIsVerifiedMachine(!isVerifiedMachine)
    queryClient.invalidateQueries({
      queryKey: ["machines"],
    })
    refetchMachine()
  }

  useEffect(() => {
    setIsVerifiedMachine(machineDetails?.item?.verified ? true : false)
  }, [isVerifiedMachine, machineDetails])

  const { register, handleSubmit } = useForm<T_Machine>({
    values: machineDetails?.item,
  })
  const onSubmit = (data: T_Machine) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["machines"],
          })
          queryClient.invalidateQueries({
            queryKey: ["machine", machineDetails?.item?._id],
          })
          queryClient.invalidateQueries({
            queryKey: ["machine-location-counts"],
          })
          toast.success("Machine details has been updated")
        } else {
          toast.error(String(data.message))
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
        setFilesToUpload([])
        mutate(
          {
            ...data,
            _id: machineDetails?.item?._id as string,
            files: [...machineDetails?.item?.files, ...uploadedNames],
          },
          callBackReq
        )
      },
      onError: (err: any) => {
        toast.error(String(err))
        mutate(
          { ...data, _id: machineDetails?.item?._id as string },
          callBackReq
        )
      },
    }
    if (filesToUpload.length > 0) {
      uploadMediaFiles(filesToUpload, uploadFilesCallBackReq)
    } else {
      mutate({ ...data, _id: machineDetails?.item?._id as string }, callBackReq)
    }
  }

  useEffect(() => {
    if (machineDetails?.item) {
      setSelectedFactoryId(machineDetails?.item?.factoryId)
    }
  }, [machineDetails])

  const partSection = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white">
          <div className="flex justify-between border-b border-gray-300 px-4 md:px-6 py-3">
            <h3 className="text-gray-800 font-semibold text-2xl">Details</h3>
            <h4 className="text-green-600 font-semibold text-2xl uppercase">
              {locationState}
            </h4>
          </div>
          <div className="flex justify-between gap-4 items-center px-4 md:px-6 py-1 mt-3">
            <input
              type="text"
              className="text-gray-800 pl-0 font-bold text-xl uppercase py-1 mt-1 mb-1 rounded-md border-0 focus:ring-1 focus:ring-blue-950 focus:pl-3 cursor-pointer focus:cursor-text disabled:opacity-70 w-full"
              defaultValue={machineDetails?.item?.name}
              disabled={
                !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                isUpdateMachineLoading ||
                isMachineDetailsLoading ||
                isFactoriesLoading ||
                isUploadMediaFilesLoading
              }
              {...register("name", { required: true })}
            />
            <button
              type="button"
              className="uppercase bg-blue-950 hover:bg-blue-900 text-white text-sm py-2 px-4 rounded-md disabled:opacity-70"
            >
              Logs
            </button>
          </div>
          <div className="px-4 md:px-6 mt-4">
            <div className="lg:flex gap-4">
              <div className="flex-1">
                <div className="grid grid-cols-4 items-center gap-y-2">
                  <label
                    htmlFor="factory"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Factory:
                  </label>
                  <select
                    id="factory"
                    className={`block col-span-2 md:mt-0 w-full text-sm rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:leading-6 disabled:opacity-70`}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdateMachineLoading ||
                      isMachineDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                    {...register("factoryId", { required: true })}
                    onChange={(e) => {
                      setSelectedFactoryId(e.target.value)
                    }}
                  >
                    <option disabled>Factory</option>
                    {factories?.items?.map((item: T_Factory, index: number) => {
                      return (
                        <option
                          key={index}
                          value={item._id as string}
                          selected={
                            item._id === machineDetails?.item?.factoryId
                          }
                        >
                          {item.name}
                        </option>
                      )
                    })}
                  </select>
                  <label
                    htmlFor="machine-class"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Machine Class:
                  </label>
                  <select
                    id="machine-class"
                    className={`block col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdateMachineLoading ||
                      isMachineDetailsLoading ||
                      isFactoriesLoading ||
                      isMachineClassesRefetching ||
                      isUploadMediaFilesLoading
                    }
                    {...register("machineClassId", { required: true })}
                  >
                    <option disabled>Machine Class</option>
                    {machineClasses?.items?.map(
                      (machine: T_MachineClass, index: number) => {
                        return (
                          <option
                            key={index}
                            value={machine._id as string}
                            selected={
                              machine._id ===
                              machineDetails?.item?.machineClassId
                            }
                          >
                            {machine.name}
                          </option>
                        )
                      }
                    )}
                  </select>
                  <label
                    htmlFor="description"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Description:
                  </label>
                  <textarea
                    rows={3}
                    id="description"
                    className={`block col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdateMachineLoading ||
                      isMachineDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                    placeholder="Details"
                    defaultValue={""}
                    {...register("description", { required: true })}
                  />
                </div>
              </div>
              <ModalMediaList
                files={machineDetails?.item?.files}
                isLoading={isMachineDetailsLoading}
                filesToUpload={filesToUpload}
                setFilesToUpload={setFilesToUpload}
              />
            </div>
          </div>
          <div className="bg-gray-100 mt-7 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 items-center justify-between">
            <div className="flex justify-center space-x-3">
              {PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ? (
                <button
                  type="submit"
                  className="uppercase flex items-center rounded-md bg-green-700 mt-3 w-full md:w-auto sm:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 disabled:opacity-70"
                  disabled={
                    !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                    isUpdateMachineLoading ||
                    isMachineDetailsLoading ||
                    isFactoriesLoading ||
                    isUploadMediaFilesLoading
                  }
                >
                  {isUpdateMachineLoading ? (
                    <div
                      className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              ) : (
                ""
              )}
              <button
                type="button"
                className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                onClick={() => {
                  onClose()
                  setFilesToUpload([])
                }}
                ref={closeButtonRef}
                tabIndex={-1}
                disabled={
                  // !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                  isUpdateMachineLoading ||
                  isMachineDetailsLoading ||
                  isFactoriesLoading ||
                  isUploadMediaFilesLoading
                }
              >
                Close
              </button>
            </div>
            {!PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ? (
              ""
            ) : (
              <button
                type="button"
                className={`uppercase mt-3 inline-flex w-full rounded-md ${
                  isVerifiedMachine
                    ? "bg-red-900 hover:bg-red-800 focus:outline-red-800"
                    : "hover:bg-green-500 bg-green-600 focus:outline-green-800"
                }  px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white  sm:mt-0 sm:w-auto`}
                onClick={() => handleButton()}
              >
                {isVerifiedMachine ? "Unverify" : "Verify"}
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={closeButtonRef}
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
                <Dialog.Panel
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 max-w-2xl lg:max-w-4xl sm:w-full sm:max-w-lg

                  }`}
                >
                  {partSection}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default MachineDetailsModal
