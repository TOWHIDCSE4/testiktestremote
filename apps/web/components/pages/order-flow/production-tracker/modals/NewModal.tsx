import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
  T_BackendResponse,
  T_Factory,
  T_Job,
  T_Machine,
  T_Part,
  T_User,
} from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useFactories from "../../../../../hooks/factories/useFactories"
import useLocations from "../../../../../hooks/locations/useLocations"
import useAddJob from "../../../../../hooks/jobs/useAddJob"
import useUsers from "../../../../../hooks/users/useUsers"
import useGetPartsByFactoryLocation from "../../../../../hooks/parts/useGetPartsByFactoryLocation"
import useProfile from "../../../../../hooks/users/useProfile"
import { useQueryClient } from "@tanstack/react-query"

interface NewModalProps {
  isOpen: boolean
  locationState: string | null
  locationId: string | null
  onClose: () => void
}

const NewModal = ({
  isOpen,
  locationState,
  locationId,
  onClose,
}: NewModalProps) => {
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const [isStock, setIsStock] = useState(false)
  const {
    data: parts,
    isLoading: isPartsLoading,
    setLocationId,
    setFactoryId,
  } = useGetPartsByFactoryLocation()

  const { register, handleSubmit, reset, watch, setValue } = useForm<T_Job>()
  const { mutate, isLoading: isMutateLoading } = useAddJob()

  const onSubmit = (data: T_Job) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["jobs"],
          })
          toast.success(String(data.message))
          closeModal()
          reset()
          setIsStock(false)
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(
      {
        ...data,
        isStock:
          typeof data.isStock === "string"
            ? Boolean(data.isStock)
            : data.isStock,
        status: "Pending",
        locationId: locationId as string,
        userId: userProfile?.item._id as string,
      },
      callBackReq
    )
  }

  const closeModal = () => {
    onClose()
  }

  useEffect(() => {
    setValue("locationId", locationId as string)
    setLocationId(locationId as string)
  }, [locationId])

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

        <div className={`fixed inset-0 overflow-y-auto z-50`}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-gray-800 font-semibold text-2xl">
                      {locationState} &gt; New Job
                    </h3>

                    <div className="md:flex items-center mt-6">
                      <label
                        htmlFor="average-cycle"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Job Name
                      </label>
                      <input
                        type="text"
                        id="average-cycle"
                        {...register("name", { required: true })}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        required
                      />
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="factory"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Factory
                      </label>
                      <select
                        disabled={isFactoriesLoading}
                        id="factory"
                        required
                        {...register("factoryId", { required: true })}
                        defaultValue="Select Factory"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        onChange={(e) => {
                          setFactoryId(e.target.value)
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
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="partId"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Part
                      </label>
                      <select
                        id="partId"
                        required
                        {...register("partId", { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="Select Part"
                        disabled={
                          !parts ||
                          parts?.items.length === 0 ||
                          isMutateLoading ||
                          isPartsLoading
                        }
                      >
                        <option value="">Select Part</option>
                        {parts?.items.map((part: T_Part, index: number) => {
                          return (
                            <option key={index} value={part._id as string}>
                              {part.name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="drawingNumber"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Drawing Number
                      </label>
                      <input
                        type="text"
                        {...register("drawingNumber")}
                        id="drawingNumber"
                        required
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                      />
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="drawingNumber"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Is Stock?
                      </label>
                      <select
                        id="isStock"
                        {...register("isStock", { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="No"
                        required
                        onChange={(e) => {
                          if (e.target.value === "true") {
                            setValue("count", undefined)
                            setValue("dueDate", null)
                            setValue("priorityStatus", undefined)
                          }
                          setIsStock(e.target.value === "true")
                        }}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    {!isStock ? (
                      <>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="drawingNumber"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Count
                          </label>
                          <input
                            type="number"
                            {...register("count", {
                              required: true,
                              valueAsNumber: true,
                            })}
                            id="drawingNumber"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            required
                          />
                        </div>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="dueDate"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Due Date
                          </label>
                          <input
                            type="date"
                            {...register("dueDate", {
                              required: true,
                              valueAsDate: true,
                            })}
                            id="dueDate"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            required
                          />
                        </div>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="priorityStatus"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Priority
                          </label>
                          <select
                            id="priorityStatus"
                            {...register("priorityStatus", { required: true })}
                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            defaultValue="High"
                            required
                          >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="ml-3 uppercase flex items-center rounded-md bg-green-700 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 disabled:opacity-70"
                    >
                      {isMutateLoading ? (
                        <div
                          className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
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
                      onClick={() => {
                        closeModal()
                        reset()
                      }}
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
export default NewModal
