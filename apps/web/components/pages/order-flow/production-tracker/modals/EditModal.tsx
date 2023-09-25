import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
  T_BackendResponse,
  T_Factory,
  T_Job,
  T_Machine,
  T_Part,
} from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useFactoryMachineClasses from "../../../../../hooks/factories/useFactoryMachineClasses"
import useGetMachineByClass from "../../../../../hooks/machines/useGetMachinesByLocation"
import useGetPartByMachineClass from "../../../../../hooks/parts/useGetPartByMachineClassLocation"
import usePart from "../../../../../hooks/parts/useGetPart"
import useAddTimer from "../../../../../hooks/timers/useAddTimer"
import useFactories from "../../../../../hooks/factories/useFactories"
import useLocations from "../../../../../hooks/locations/useLocations"
import useGetJob from "../../../../../hooks/jobs/useGetJob"
import useGetUser from "../../../../../hooks/users/useGetUser"
import useUsers from "../../../../../hooks/users/useUsers"
import useGetPartsByFactoryLocation from "../../../../../hooks/parts/useGetPartsByFactoryLocation"
import useUpdatePart from "../../../../../hooks/parts/useUpdatePart"
import useUpdateJob from "../../../../../hooks/jobs/useUpdateJob"
import { useQueryClient } from "@tanstack/react-query"

interface EditModalProps {
  isOpen: boolean
  jobId: string
  currentTab: string
  onClose: () => void
}

const EditModal = ({ isOpen, currentTab, onClose, jobId }: EditModalProps) => {
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()

  const { data: jobData, isLoading: jobIsLoading } = useGetJob(jobId)
  const { mutate, isLoading: isMutateLoading } = useUpdateJob()

  const {
    data: partsData,
    isLoading: partsIsLoading,
    setFactoryId,
    setLocationId,
  } = useGetPartsByFactoryLocation()
  useEffect(() => {
    if (jobData && !jobIsLoading) {
      setLocationId(jobData.item.locationId)
      setFactoryId(jobData.item.factoryId)
    }
  }, [jobData])

  const { register, handleSubmit, reset, watch } = useForm<T_Job>({
    values: jobData?.item,
  })

  const onSubmit = (data: T_Job) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          toast.success(String(data.message))
          queryClient.invalidateQueries({
            queryKey: ["jobs"],
          })
          closeModal()
          reset()
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(data, callBackReq)
  }

  const closeModal = () => {
    onClose()
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-gray-800 font-semibold text-2xl">
                      Edit Job
                    </h3>

                    <div className="md:flex items-center mt-6">
                      <label
                        htmlFor="average-cycle"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Job Name
                        <span className="text-red-500 top-[-3px] relative">
                          {" "}
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        id="average-cycle"
                        {...register("name", { required: true })}
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                        required
                        disabled={jobIsLoading}
                      />
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="factory"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Factory
                        <span className="text-red-500 top-[-3px] relative">
                          {" "}
                          *
                        </span>
                      </label>
                      <select
                        disabled={isFactoriesLoading}
                        id="factory"
                        required
                        {...register("factoryId", { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
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
                        htmlFor="machine-part"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Part
                        <span className="text-red-500 top-[-3px] relative">
                          {" "}
                          *
                        </span>
                      </label>
                      <select
                        id="machine-part"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        required
                        {...register("partId", { required: true })}
                      >
                        <option value="">Select Product</option>
                        {partsData?.items.map((key, index) => (
                          <option key={index} value={key._id as string}>
                            {key.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:flex items-center mt-3">
                      <label
                        htmlFor="drawingNumber"
                        className="uppercase font-semibold text-gray-800 md:w-36"
                      >
                        Drawing Number
                        <span className="text-red-500 top-[-3px] relative">
                          {" "}
                          *
                        </span>
                      </label>
                      <input
                        type="text"
                        {...register("drawingNumber")}
                        id="drawingNumber"
                        disabled={jobIsLoading}
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
                        disabled={jobIsLoading}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    {String(watch("isStock")) === "false" ||
                    !watch("isStock") ? (
                      <>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="drawingNumber"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Count
                            <span className="text-red-500 top-[-3px] relative">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="number"
                            {...register("count", { required: true })}
                            id="drawingNumber"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            required
                            disabled={jobIsLoading}
                          />
                        </div>
                        <div className="md:flex items-center mt-3">
                          <label
                            htmlFor="dueDate"
                            className="uppercase font-semibold text-gray-800 md:w-36"
                          >
                            Due Date
                            <span className="text-red-500 top-[-3px] relative">
                              {" "}
                              *
                            </span>
                          </label>
                          <input
                            type="date"
                            {...register("dueDate", { required: true })}
                            id="dueDate"
                            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                            required
                            disabled={jobIsLoading}
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
                            disabled={jobIsLoading}
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
                      disabled={jobIsLoading}
                      type="submit"
                      className="sm:ml-3 uppercase flex items-center justify-center rounded-md bg-green-700 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 disabled:opacity-70"
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
                        "Update"
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
export default EditModal
