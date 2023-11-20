"use client"
import { Fragment, useRef, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import EditModal from "./EditModal"
import useGetPart from "../../../../../hooks/parts/useGetPart"
import useFactories from "../../../../../hooks/factories/useFactories"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import {
  T_BackendResponse,
  T_Factory,
  T_MachineClass,
  T_Part,
} from "custom-validator"
import useLocations from "../../../../../hooks/locations/useLocations"
import useUpdatePart from "../../../../../hooks/parts/useUpdatePart"
import toast from "react-hot-toast"
import ModalMediaList from "./ModalMediaList"
import { FileWithPath } from "react-dropzone"
import useUploadMediaFiles from "../../../../../hooks/media/useUploadMediaFiles"
import useGetProductLogs from "../../../../../hooks/timerLogs/useGetProductLogs"
import useVerifiedPart from "../../../../../hooks/parts/useUpdateVerifiedPart"
import Cookies from "js-cookie"
import {
  API_URL_VERIFIED_PART,
  USER_ROLES,
} from "../../../../../helpers/constants"
import useStoreSession from "../../../../../store/useStoreSession"

const _ = require("lodash")

interface DetailsModalProps {
  isOpen: boolean
  locationState: string
  onClose: () => void
  id?: string
}

const PRODUCTION_ADMIN_ROLES = [USER_ROLES.Administrator, USER_ROLES.Production]

const PartDetailsModal = ({
  isOpen,
  locationState,
  onClose,
  id,
}: DetailsModalProps) => {
  const queryClient = useQueryClient()
  const storeSession = useStoreSession((state) => state)
  const closeButtonRef = useRef(null)
  const { mutate: uploadMediaFiles, isLoading: isUploadMediaFilesLoading } =
    useUploadMediaFiles()
  const [filesToUpload, setFilesToUpload] = useState<
    (FileWithPath & { preview: string })[]
  >([])
  const [openEditModal, setOpenEditModal] = useState(false)

  const {
    data: partDetails,
    isLoading: isPartDetailsLoading,
    refetch: refetchPart,
  } = useGetPart(id)
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  // const { mutate: toVerify, isLoading: isVerifyLoading } = useVerifiedPart(id as string)
  // const {mutate: toVerify, isLoading: isVerifyLoading } = useVerifiedPart(id as string);
  const {
    refetch: refetchMachineClasses,
    data: machineClasses,
    isRefetching: isMachineClassesRefetching,
    setSelectedFactoryId,
    selectedFactoryId,
  } = useFactoryMachineClasses()
  const { data: productLogs, isLoading: isProductLogsLoading } =
    useGetProductLogs(id)
  const { mutate, isLoading: isUpdatePartLoading } = useUpdatePart()
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<T_Part>({
    values: partDetails?.item,
  })
  const [factoryId, setFactoryId] = useState(partDetails?.item?.factoryId)
  const [isVerifiedPart, setIsVerifiedPart] = useState(
    partDetails?.item?.verified ? true : false
  )

  const handleButton = async () => {
    const token = Cookies.get("tfl")
    const res = await fetch(`${API_URL_VERIFIED_PART}/${id}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    await res.json()
    setIsVerifiedPart(!isVerifiedPart)
    console.log(`recalled the api`)
    queryClient.invalidateQueries({
      queryKey: ["parts"],
    })
    refetchPart()
  }

  useEffect(() => {
    setIsVerifiedPart(partDetails?.item?.verified ? true : false)
  }, [partDetails, isVerifiedPart])

  const isFactoryNotChanged: boolean =
    partDetails?.item?.factoryId && factoryId
      ? partDetails?.item?.factoryId === factoryId
      : true
  const anyChange = !(isDirty || !isFactoryNotChanged)

  useEffect(() => {
    setSelectedFactoryId(
      isFactoryNotChanged ? partDetails?.item?.factoryId : selectedFactoryId
    )
  }),
    [partDetails, selectedFactoryId]

  const onSubmit = (data: T_Part) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["parts"],
          })
          queryClient.invalidateQueries({
            queryKey: ["part", partDetails?.item?._id],
          })
          queryClient.invalidateQueries({
            queryKey: ["part-location-counts"],
          })
          toast.success("Part details has been updated")
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
            _id: partDetails?.item?._id as string,
            files: [...partDetails?.item?.files, ...uploadedNames],
          },
          callBackReq
        )
      },
      onError: (err: any) => {
        toast.error(String(err))
        mutate({ ...data, _id: partDetails?.item?._id as string }, callBackReq)
      },
    }
    if (filesToUpload.length > 0) {
      uploadMediaFiles(filesToUpload, uploadFilesCallBackReq)
    } else {
      mutate({ ...data, _id: partDetails?.item?._id as string }, callBackReq)
    }
  }

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
              defaultValue={partDetails?.item?.name}
              disabled={
                !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                isUpdatePartLoading ||
                isPartDetailsLoading ||
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
              <div>
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
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                    {...register("factoryId", { required: true })}
                    onChange={(e) => {
                      setSelectedFactoryId(e.target.value)
                      setFactoryId(e.target.value)
                    }}
                  >
                    <option disabled>Factory</option>
                    {factories?.items?.map((item: T_Factory, index: number) => {
                      return (
                        <option
                          key={index}
                          value={item._id as string}
                          selected={item._id === partDetails?.item?.factoryId}
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
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
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
                              machine._id === partDetails?.item?.machineClassId
                            }
                          >
                            {machine.name}
                          </option>
                        )
                      }
                    )}
                  </select>
                  <label
                    htmlFor="tons"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Tons:
                  </label>
                  <input
                    id="tons"
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    defaultValue={partDetails?.item?.tons}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                    {...register("tons", { required: true })}
                  />
                  <label
                    htmlFor="time"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Time (seconds):
                  </label>
                  <input
                    id="time"
                    {...register("time", { required: true })}
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    defaultValue={partDetails?.item?.time}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                  />
                  <label
                    htmlFor="finish-good-weight"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Finish Good Weight:
                  </label>
                  <input
                    id="finishGoodWeight"
                    {...register("finishGoodWeight")}
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    defaultValue={partDetails?.item?.finishGoodWeight}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                  />
                  <label
                    htmlFor="cage-weight-actual"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Cage Weight Actual:
                  </label>
                  <input
                    id="cageWeightActual"
                    {...register("cageWeightActual")}
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    defaultValue={partDetails?.item?.cageWeightActual}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                  />
                  <label
                    htmlFor="cage-weight-scrap"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Cage Weight Scrap:
                  </label>
                  <input
                    id="cageWeightScrap"
                    {...register("cageWeightScrap")}
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                    defaultValue={partDetails?.item?.cageWeightScrap}
                    disabled={
                      !PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ||
                      isUpdatePartLoading ||
                      isPartDetailsLoading ||
                      isFactoriesLoading ||
                      isUploadMediaFilesLoading
                    }
                  />
                  <label
                    htmlFor="cage-weight-scrap"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    In Inventory:
                  </label>
                  <input
                    id="inInventory"
                    {...register("inInventory")}
                    className={`block uppercase col-span-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-700 font-medium ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed`}
                    disabled={
                      PRODUCTION_ADMIN_ROLES.includes(storeSession.role)
                        ? false
                        : true
                    }
                    defaultValue={
                      productLogs?.item?.inInverntory
                        ? productLogs?.item?.inInverntory
                        : 0
                    }
                  />
                  <label
                    htmlFor="cage-weight-scrap"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Manufacture Cost:
                  </label>
                  <div className="relative rounded-md shadow-sm col-span-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="manufactureCost"
                      {...register("manufactureCost")}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="0.00"
                      disabled={
                        PRODUCTION_ADMIN_ROLES.includes(storeSession.role)
                          ? false
                          : true
                      }
                      defaultValue={
                        productLogs?.item?.manufactureCost
                          ? productLogs?.item?.manufactureCost
                          : 0
                      }
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span
                        className="text-gray-500 sm:text-sm"
                        id="price-currency"
                      >
                        USD
                      </span>
                    </div>
                  </div>
                  <label
                    htmlFor="cage-weight-scrap"
                    className="text-gray-700 uppercase font-semibold mr-3 text-sm whitespace-nowrap col-span-2"
                  >
                    Top Sell Price:
                  </label>
                  <div className="relative rounded-md shadow-sm col-span-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="topSellPrice"
                      {...register("topSellPrice")}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed"
                      placeholder="0.00"
                      disabled={
                        PRODUCTION_ADMIN_ROLES.includes(storeSession.role)
                          ? false
                          : true
                      }
                      defaultValue={
                        productLogs?.item?.opSellPrice
                          ? productLogs?.item?.opSellPrice
                          : 0
                      }
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span
                        className="text-gray-500 sm:text-sm"
                        id="price-currency"
                      >
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ModalMediaList
                files={partDetails?.item?.files}
                isLoading={isPartDetailsLoading}
                filesToUpload={filesToUpload}
                setFilesToUpload={setFilesToUpload}
              />
            </div>
          </div>
          <div className="bg-gray-100 mt-7 px-4 py-3 sm:flex sm:flex-row-reverse items-center sm:px-6 justify-between">
            <div className="flex items-center space-x-3">
              {PRODUCTION_ADMIN_ROLES.includes(storeSession.role) ? (
                <button
                  type="submit"
                  className={`uppercase flex items-center rounded-md  mt-3 w-full md:w-auto sm:mt-0 md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70 ${
                    !anyChange
                      ? "bg-green-700 focus-visible:outline-green-900 hover:bg-green-800"
                      : "bg-gray-400 hover:bg-gray-500"
                  }`}
                  disabled={
                    isUpdatePartLoading ||
                    isPartDetailsLoading ||
                    isFactoriesLoading ||
                    isUploadMediaFilesLoading ||
                    anyChange
                  }
                >
                  {isUpdatePartLoading || isUploadMediaFilesLoading ? (
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
                  isUpdatePartLoading ||
                  isPartDetailsLoading ||
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
                  isVerifiedPart
                    ? "bg-red-900 hover:bg-red-800 focus:outline-red-800"
                    : "hover:bg-green-500 bg-green-600 focus:outline-green-800"
                }  px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white  sm:mt-0 sm:w-auto`}
                onClick={() => handleButton()}
              >
                {isVerifiedPart ? "Unverify" : "Verify"}
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
      <EditModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
    </>
  )
}
export default PartDetailsModal
