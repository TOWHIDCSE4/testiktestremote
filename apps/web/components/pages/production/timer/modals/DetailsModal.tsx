"use client"
import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { T_BackendResponse, T_Timer, T_User } from "custom-validator"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import toast from "react-hot-toast"
import useUpdateTimer from "../../../../../hooks/timers/useUpdateTimer"
import useUsers from "../../../../../hooks/users/useUsers"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"
import PartDetailsModal from "../../product-list/modals/PartDetailsModal"

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  id?: string
}

const DetailsModal = ({ isOpen, onClose, id }: DetailsModalProps) => {
  const queryClient = useQueryClient()
  const closeButtonRef = useRef(null)
  const searchRef = useRef(null)
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const { data: timerDetailData, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(id)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
    setValue,
    watch,
  } = useForm<T_Timer>({
    values: timerDetailData?.item,
  })
  const [operatorQuery, setOperatorQuery] = useState("")
  const [selectedOperator, setSelectedOperator] = useState({
    id: "",
    name: "",
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

  const filteredOperator =
    operatorQuery === ""
      ? users?.items?.slice(0, 30)
      : users?.items
          ?.filter((user) => {
            return (
              user.firstName
                .toLowerCase()
                .includes(operatorQuery.toLowerCase()) ||
              user.lastName.toLowerCase().includes(operatorQuery.toLowerCase())
            )
          })
          ?.slice(0, 30)

  useEffect(() => {
    if (timerDetailData?.item?.operator?._id) {
      setSelectedOperator({
        id: timerDetailData?.item?.operator?._id as string,
        name: `${timerDetailData?.item?.operator?.firstName} ${timerDetailData?.item?.operator?.lastName}`,
      })
    }
  }, [timerDetailData])

  useEffect(() => {
    if (selectedOperator.id) {
      setValue("operator", selectedOperator.id, { shouldDirty: true })
    }
  }, [selectedOperator])

  // Remove focus for operator combobox
  useEffect(() => {
    setTimeout(() => {
      // @ts-ignore
      searchRef.current?.blur()
    }, 0)
  }, [])

  useEffect(() => {
    if (!openDetailsModal) {
      queryClient.invalidateQueries({
        queryKey: ["timer", id],
      })
    }
  }, [openDetailsModal])

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

          <div className={`fixed inset-0 z-50 overflow-auto`}>
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
                                Product Name:
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
                              <div className="col-span-2">
                                <Combobox
                                  as="div"
                                  value={selectedOperator}
                                  onChange={setSelectedOperator}
                                  disabled={isTimerDetailDataLoading}
                                >
                                  <div className="relative">
                                    <Combobox.Input
                                      className={`block mt-0 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 text-sm sm:leading-6 disabled:cursor-not-allowed disabled:opacity-70`}
                                      onChange={(event) =>
                                        setOperatorQuery(event.target.value)
                                      }
                                      displayValue={(selected: {
                                        id: string
                                        name: string
                                      }) => {
                                        return selected ? selected.name : ""
                                      }}
                                      placeholder="Search Operator"
                                      required
                                      ref={searchRef}
                                    />
                                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                      <ChevronUpDownIcon
                                        className={`h-5 w-5 ${
                                          isTimerDetailDataLoading
                                            ? "text-gray-400"
                                            : "text-gray-600"
                                        }`}
                                        aria-hidden="true"
                                      />
                                    </Combobox.Button>

                                    {filteredOperator &&
                                    filteredOperator.length > 0 ? (
                                      <Combobox.Options className="absolute z-[10000] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredOperator.map(
                                          (item: T_User, index: number) => (
                                            <Combobox.Option
                                              key={index}
                                              value={{
                                                id: item._id,
                                                name: `${item.firstName} ${item.lastName}`,
                                              }}
                                              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white`}
                                            >
                                              <span className="block">{`${item.firstName} ${item.lastName}`}</span>
                                            </Combobox.Option>
                                          )
                                        )}
                                      </Combobox.Options>
                                    ) : null}
                                  </div>
                                </Combobox>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 mt-16 lg:mt-7 px-4 py-3 sm:flex sm:justify-between sm:px-6">
                        <button
                          type="button"
                          className="uppercase inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-70 sm:w-auto"
                          disabled={
                            isTimerDetailDataLoading || isUpdateTimerLoading
                          }
                          onClick={() => setOpenDetailsModal(true)}
                        >
                          Edit Part
                        </button>
                        <div>
                          <button
                            type="button"
                            className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                            onClick={() => {
                              setSelectedOperator({
                                id: "",
                                name: "",
                              })
                              setOperatorQuery("")
                              onClose()
                              reset()
                            }}
                          >
                            Close
                          </button>
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
                        </div>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
          <PartDetailsModal
            isOpen={openDetailsModal}
            locationState={
              timerDetailData?.item?.locationId
                ? timerDetailData?.item?.locationId.name
                : "Loading..."
            }
            onClose={() => setOpenDetailsModal(false)}
            id={timerDetailData?.item?.partId?._id as string}
          />
        </Dialog>
      </Transition.Root>
    </>
  )
}
export default DetailsModal
