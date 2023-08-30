"use client"
import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { T_BackendResponse, T_Timer, T_User } from "custom-validator"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import toast from "react-hot-toast"
import useUpdateTimer from "../../../../../hooks/timers/useUpdateTimer"
import useUsers from "../../../../../hooks/users/useUsers"

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  id?: string
}

const DetailsModal = ({ isOpen, onClose, id }: DetailsModalProps) => {
  const queryClient = useQueryClient()
  const closeButtonRef = useRef(null)
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(id)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<T_Timer>({
    values: timerDetailData?.item,
  })

  const onSubmit = (data: T_Timer) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["timer", id],
          })
          toast.success("Timer details has been updated")
          reset()
          onClose()
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
        factoryId:
          typeof data.factoryId === "object"
            ? (data.factoryId?._id as string)
            : data.factoryId,
        locationId:
          typeof data.locationId === "object"
            ? (data.locationId?._id as string)
            : data.locationId,
        partId:
          typeof data.partId === "object"
            ? (data.partId?._id as string)
            : data.partId,
        machineId:
          typeof data.machineId === "object"
            ? (data.machineId?._id as string)
            : data.machineId,
        createdBy:
          typeof data.createdBy === "object"
            ? (data.createdBy?._id as string)
            : data.createdBy,
      },
      callBackReq
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
                  className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full md:max-w-2xl lg:max-w-xl sm:max-w-lg`}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white">
                      <div className="md:flex justify-between border-b border-gray-300 px-4 md:px-6 py-3">
                        <h3 className="text-gray-800 font-semibold text-2xl">
                          Timer Details
                        </h3>
                        <h3 className="text-gray-800 text-lg flex items-center gap-1">
                          <span>Created by</span>
                          {isTimerDetailDataLoading ? (
                            <div className="animate-pulse flex">
                              <div className="h-4 w-20 rounded-full bg-slate-200"></div>
                            </div>
                          ) : (
                            <span className="text-blue-900 font-semibold">
                              {timerDetailData?.item?.createdBy?.firstName}{" "}
                              {timerDetailData?.item?.createdBy?.lastName}
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="px-4 md:px-6 mt-8">
                        <div>
                          <div>
                            <div className="grid md:grid-cols-4 items-center gap-y-2 w-full">
                              <label
                                htmlFor="product-name"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Part/Product Name:
                              </label>
                              <input
                                type="text"
                                id="product-name"
                                className={`block mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed`}
                                disabled
                                {...register("partId.name", { required: true })}
                              />
                              <label
                                htmlFor="weight"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Weight (Tons):
                              </label>
                              <input
                                type="number"
                                id="weight"
                                className={`block mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed`}
                                disabled
                                {...register("partId.tons", {
                                  required: true,
                                })}
                              />
                              <label
                                htmlFor="production-time"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Time (seconds):
                              </label>
                              <input
                                type="text"
                                id="production-time"
                                className={`block mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed`}
                                disabled
                                {...register("partId.time", { required: true })}
                              />
                              <label
                                htmlFor="operator-name"
                                className="uppercase font-semibold text-sm text-gray-800 col-span-2"
                              >
                                Operator:
                              </label>
                              <select
                                id="user"
                                {...register("operator", { required: true })}
                                className={`block mt-0 w-full col-span-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 disabled:opacity-70`}
                                defaultValue="Select Operator"
                                disabled={
                                  isTimerDetailDataLoading ||
                                  isUpdateTimerLoading ||
                                  isUsersLoading
                                }
                                required
                              >
                                <option value="">Select Operator</option>
                                {users?.items?.map(
                                  (item: T_User, index: number) => {
                                    return (
                                      <option
                                        key={index}
                                        value={item._id as string}
                                      >
                                        {item.firstName} {item.lastName}
                                      </option>
                                    )
                                  }
                                )}
                              </select>
                            </div>
                          </div>
                          {/* <div className="lg:w-[400px] mt-5 lg:mt-0">
                            <div className="w-full">
                              <div className="text-gray-400 text-sm border-2 border-gray-300 text-center rounded-md h-52 p-5"></div>
                              <div className="border-2 border-gray-300 rounded-md p-2 mt-2 h-28">
                                <div className="grid grid-cols-5">
                                  <div className="col-span-3 text-xs text-gray-600">
                                    File Name
                                  </div>
                                  <div className="col-span-2 text-xs text-gray-600">
                                    File Type
                                  </div>
                                  <div className="col-span-3 text-sm font-light text-gray-400 mt-2">
                                    No Media Previews
                                  </div>
                                </div>
                              </div>
                              <button
                                disabled={isTimerDetailDataLoading}
                                className="uppercase dsiabled:opacity-70 float-right mt-2 bg-blue-800 hover:bg-blue-700 text-white text-sm py-1 px-4 rounded-md"
                              >
                                Upload
                              </button>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 mt-16 lg:mt-7 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="submit"
                          className="uppercase inline-flex w-full items-center justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 disabled:opacity-70 sm:w-auto"
                          disabled={
                            isTimerDetailDataLoading ||
                            isUpdateTimerLoading ||
                            !isDirty
                          }
                        >
                          {isUpdateTimerLoading ? (
                            <div
                              className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"
                              role="status"
                              aria-label="loading"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          type="button"
                          className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                          onClick={() => {
                            onClose()
                            reset()
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default DetailsModal
