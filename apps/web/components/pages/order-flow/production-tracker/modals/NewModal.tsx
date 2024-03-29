import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
  T_BackendResponse,
  T_Factory,
  T_Job,
  T_JobTimer,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
  T_User,
} from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useFactories from "../../../../../hooks/factories/useFactories"
import useAddJob from "../../../../../hooks/jobs/useAddJob"
import useProfile from "../../../../../hooks/users/useProfile"
import { useQueryClient } from "@tanstack/react-query"
import useUpdateJobTimer from "../../../../../hooks/jobTimer/useUpdateJobTimer"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"
import useGetPartByMachineClassLocation from "../../../../../hooks/parts/useGetPartByMachineClassLocation"
import useMachineClasses from "../../../../../hooks/machineClasses/useMachineClasses"

interface NewModalProps {
  isOpen: boolean
  locationState: string | null
  locationId: string | null
  onClose: () => void
  jobTimer?: T_JobTimer
  partId?: string
  timerDetails?: T_Timer
  timer: boolean
  // when submit is succeeded
  callback?: (data?: any) => void
}

const NewModal = ({
  isOpen,
  locationState,
  locationId,
  onClose,
  jobTimer,
  partId,
  timerDetails,
  timer,
  callback,
}: NewModalProps) => {
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const [isStock, setIsStock] = useState(false)
  const [partQuery, setPartQuery] = useState("")
  const { data: machineClasses, isLoading: isMachineClassesLoading } =
    useMachineClasses()
  const [selectedPart, setSelectedPart] = useState({
    id: "",
    name: "",
  })
  const {
    data: parts,
    isLoading: isPartsLoading,
    selectedMachineClassId,
    setSelectedMachineClassId,
    setSelectedLocationId: setLocationId,
  } = useGetPartByMachineClassLocation()

  const { register, handleSubmit, reset, watch, setValue } = useForm<T_Job>()
  const { mutate: addNewJob, isLoading: isAddNewJobLoading } = useAddJob()
  const { mutate: updateJobTimer, isLoading: isUpdateJobTimerLoading } =
    useUpdateJobTimer()

  const isTimerJobAdd = () => {
    if (Object.keys(timerDetails ?? {})?.length > 0) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (timerDetails && Object.keys(timerDetails ?? {})?.length > 0) {
      setValue(
        "machineClassId",
        (typeof timerDetails?.machineClassId === "object"
          ? timerDetails?.machineClassId?._id
          : timerDetails?.machineClassId) ?? ""
      )

      typeof timerDetails?.partId === "object"
        ? setSelectedPart({
            id: timerDetails?.partId?._id as string,
            name: timerDetails?.partId?.name,
          })
        : setSelectedPart({
            id: timerDetails?.partId as string,
            name: "",
          })
    }
  }, [timerDetails, isOpen])
  const mutateJobTimer = (jobId: string) => {
    if (jobTimer) {
      const callBackReq = {
        onSuccess: (data: T_BackendResponse) => {
          if (!data.error) {
            queryClient.invalidateQueries({
              queryKey: ["job-timer-timer"],
            })
            queryClient.invalidateQueries({
              queryKey: ["timer-jobs"],
            })
            toast.success("Timer has been updated")
            closeModal()
            reset()
            setIsStock(false)
          } else {
            toast.error(String(data.message))
          }
          callback?.()
        },
        onError: (err: any) => {
          toast.error(String(err))
          callback?.()
        },
      }
      updateJobTimer({ ...jobTimer, jobId }, callBackReq)
    }
  }

  const onSubmit = (data: T_Job) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["jobs"],
          })
          queryClient.invalidateQueries({
            queryKey: ["job-timer-timer"],
          })
          toast.success(String(data.message))
          setSelectedPart(
            timer
              ? selectedPart
              : {
                  id: "",
                  name: "",
                }
          )
          if (jobTimer) {
            mutateJobTimer(data?.item?._id as string)
          } else {
            closeModal()
            reset()
            setIsStock(false)
          }
        } else {
          toast.error(String(data.message))
        }
        callback?.()
      },
      onError: (err: any) => {
        toast.error(String(err))
        callback?.()
      },
    }
    addNewJob(
      {
        ...data,
        isStock:
          typeof data.isStock === "string"
            ? data.isStock === "true"
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

  useEffect(() => {
    if (selectedPart && typeof selectedPart === "object") {
      setPartQuery(selectedPart.name as string)
      setValue("partId", selectedPart.id as string)
    }
  }, [selectedPart])

  useEffect(() => {
    if (timer) {
      if (typeof selectedPart === "object" && selectedPart.name) {
        setPartQuery(selectedPart.name)
      }
    }
  })

  useEffect(() => {
    if (locationId) {
      setLocationId(locationId)
      setValue("locationId", locationId as string)
      setValue("partId", partId as string)
    }
  }, [locationId])

  // TODO: this is a temporary fix to here
  const filteredParts =
    partQuery === ""
      ? parts?.items?.slice(0, 30) || []
      : parts?.items
          ?.filter((timer) => {
            return timer.name.toLowerCase().includes(partQuery.toLowerCase())
          })
          ?.slice(0, 30) || []

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
          <div className="fixed inset-0 z-50 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className={`fixed inset-0 overflow-y-auto z-50`}>
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                    <h3 className="text-2xl font-semibold text-gray-800">
                      {locationState} &gt; New Job
                    </h3>

                    <div className="items-center mt-3 md:flex">
                      <label
                        htmlFor="drawingNumber"
                        className="font-semibold text-gray-800 uppercase md:w-36"
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
                        disabled={
                          isAddNewJobLoading ||
                          isProfileLoading ||
                          isUpdateJobTimerLoading
                        }
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    {isStock === false && (
                      <div className="items-center mt-6 md:flex">
                        <label
                          htmlFor="average-cycle"
                          className="font-semibold text-gray-800 uppercase md:w-36"
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
                          disabled={
                            isAddNewJobLoading ||
                            isProfileLoading ||
                            isUpdateJobTimerLoading
                          }
                        />
                      </div>
                    )}
                    <div className="items-center mt-3 md:flex">
                      <label
                        htmlFor="machine-process"
                        className="font-semibold text-gray-800 uppercase md:w-36"
                      >
                        Machine Class
                        <span className="text-red-500 top-[-3px] relative">
                          {" "}
                          *
                        </span>
                      </label>
                      <select
                        id="machineClass"
                        required
                        className={`block mt-2 md:mt-0 w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${
                          isTimerJobAdd() ||
                          isMachineClassesLoading ||
                          isAddNewJobLoading
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                        disabled={
                          isTimerJobAdd() ||
                          isMachineClassesLoading ||
                          isAddNewJobLoading
                        }
                        {...register("machineClassId", { required: true })}
                        defaultValue={
                          (typeof timerDetails?.machineClassId === "object"
                            ? timerDetails?.machineClassId?._id
                            : timerDetails?.machineClassId) ?? ""
                        }
                        onChange={(e) => {
                          {
                            setSelectedPart({
                              id: "",
                              name: "",
                            })
                            if (!timer) {
                              setPartQuery("")
                            }
                            setSelectedMachineClassId(e.target.value)
                          }
                        }}
                      >
                        <option value="">Select Machine Class</option>
                        {machineClasses?.items?.map(
                          (machineClass: T_MachineClass, index: number) => {
                            return (
                              <option
                                key={index}
                                value={machineClass._id as string}
                              >
                                {machineClass.name}
                              </option>
                            )
                          }
                        )}
                      </select>
                    </div>
                    <div className="items-center mt-3 md:flex">
                      <label
                        htmlFor="partId"
                        className="uppercase font-semibold text-gray-800 md:w-[8.5rem]"
                      >
                        Part
                        <span className="text-red-500 top-[-3px] relative">
                          {" "}
                          *
                        </span>
                      </label>
                      <div className="block w-full">
                        <Combobox
                          as="div"
                          value={selectedPart}
                          onChange={setSelectedPart}
                          disabled={
                            isTimerJobAdd() ||
                            isPartsLoading ||
                            isAddNewJobLoading ||
                            isUpdateJobTimerLoading ||
                            parts?.items?.length === 0
                          }
                        >
                          <div className="relative w-full">
                            <Combobox.Input
                              className={`block w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 disabled:opacity-70 disabled:cursor-not-allowed`}
                              displayValue={(selected: {
                                id: string
                                name: string
                                factoryId: string
                              }) => {
                                return selected ? selected.name : partQuery
                              }}
                              required
                              onChange={(event) =>
                                setPartQuery(event.target.value)
                              }
                              value={
                                timer
                                  ? partQuery
                                  : selectedMachineClassId
                                  ? partQuery
                                  : ""
                              }
                              placeholder="Search Part"
                              autoComplete="off"
                              onBlur={() => {
                                partQuery
                              }}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                              <ChevronUpDownIcon
                                className={`h-5 w-5 ${
                                  filteredParts?.length === 0
                                    ? "text-gray-300"
                                    : "text-gray-500"
                                }`}
                                aria-hidden="true"
                              />
                            </Combobox.Button>

                            {filteredParts && filteredParts.length > 0 ? (
                              <Combobox.Options className="absolute z-[10000] mt-1 max-h-28 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredParts.map(
                                  (item: T_Part, index: number) => (
                                    <Combobox.Option
                                      key={index}
                                      value={{
                                        id: item._id,
                                        name: item.name,
                                        factoryId: item.factoryId,
                                      }}
                                      className={`relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-blue-600 hover:text-white`}
                                    >
                                      <span className="block">{item.name}</span>
                                    </Combobox.Option>
                                  )
                                )}
                              </Combobox.Options>
                            ) : null}
                          </div>
                        </Combobox>
                      </div>
                    </div>
                    {isStock && (
                      <div className="items-center mt-3 md:flex">
                        <div className="block w-90">
                          {selectedPart?.name && (
                            <p className="italic text-gray-300 ml-22 sm:ml-28">
                              (STOCK) {selectedPart?.name}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {isStock ? null : (
                      <div className="items-center mt-3 md:flex">
                        <label
                          htmlFor="drawingNumber"
                          className="font-semibold text-gray-800 uppercase md:w-36"
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
                          required
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                          disabled={
                            isAddNewJobLoading ||
                            isProfileLoading ||
                            isUpdateJobTimerLoading
                          }
                        />
                      </div>
                    )}
                    {!isStock ? (
                      <>
                        <div className="items-center mt-3 md:flex">
                          <label
                            htmlFor="drawingNumber"
                            className="font-semibold text-gray-800 uppercase md:w-36"
                          >
                            Count
                            <span className="text-red-500 top-[-3px] relative">
                              {" "}
                              *
                            </span>
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
                            disabled={
                              isAddNewJobLoading ||
                              isProfileLoading ||
                              isUpdateJobTimerLoading
                            }
                          />
                        </div>
                        <div className="items-center mt-3 md:flex">
                          <label
                            htmlFor="dueDate"
                            className="font-semibold text-gray-800 uppercase md:w-36"
                          >
                            Due Date
                            <span className="text-red-500 top-[-3px] relative">
                              {" "}
                              *
                            </span>
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
                            disabled={
                              isAddNewJobLoading ||
                              isProfileLoading ||
                              isUpdateJobTimerLoading
                            }
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </>
                    ) : null}

                    <div className="items-center mt-3 md:flex">
                      <label
                        htmlFor="priorityStatus"
                        className="font-semibold text-gray-800 uppercase md:w-36"
                      >
                        Priority
                      </label>
                      <select
                        id="priorityStatus"
                        {...register("priorityStatus", { required: true })}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        defaultValue="High"
                        required
                        disabled={
                          isAddNewJobLoading ||
                          isProfileLoading ||
                          isUpdateJobTimerLoading
                        }
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 md:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="md:ml-3 justify-center uppercase flex items-center rounded-md bg-green-700 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 disabled:opacity-70"
                    >
                      {isAddNewJobLoading || isUpdateJobTimerLoading ? (
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
                      className="md:ml-3 justify-center uppercase flex items-center rounded-md bg-white mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70"
                      onClick={() => {
                        closeModal()
                        reset()
                        setIsStock(false)
                        setSelectedPart(
                          timer
                            ? selectedPart
                            : {
                                id: "",
                                name: "",
                              }
                        )
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
