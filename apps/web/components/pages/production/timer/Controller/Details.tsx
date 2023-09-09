import {
  T_BackendResponse,
  T_Job,
  T_JobTimer,
  T_Timer,
  T_User,
} from "custom-validator"
import React, { useEffect, useState } from "react"
import useUsers from "../../../../../hooks/users/useUsers"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import useUpdateTimer from "../../../../../hooks/timers/useUpdateTimer"
import useGetTimerJobs from "../../../../../hooks/timers/useGetTimerJobs"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"

type T_Props = {
  timerDetails: T_Timer
  isLoading: boolean
  readingMessages: string[]
  sectionDiv: React.RefObject<HTMLDivElement>
  jobTimer: T_JobTimer
  isJobTimerLoading: boolean
}

const Details = ({
  timerDetails,
  isLoading,
  readingMessages,
  sectionDiv,
  jobTimer,
  isJobTimerLoading,
}: T_Props) => {
  const queryClient = useQueryClient()
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const locationId =
    typeof timerDetails?.locationId === "object" && timerDetails?.locationId._id
      ? timerDetails?.locationId._id
      : ""
  const factoryId =
    typeof timerDetails?.factoryId === "object" && timerDetails?.factoryId._id
      ? timerDetails?.factoryId._id
      : ""
  const partId =
    typeof timerDetails?.partId === "object" && timerDetails?.partId._id
      ? timerDetails?.partId._id
      : ""
  const {
    data: timerJobs,
    isLoading: isTimerJobsLoading,
    setFactoryId,
    setLocationId,
    setPartId,
  } = useGetTimerJobs()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const [operatorQuery, setOperatorQuery] = useState("")
  const [selectedOperator, setSelectedOperator] = useState({
    id: "",
    name: "",
  })
  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timer", timerDetails._id],
        })
        toast.success("Timer has been updated")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }
  useEffect(() => {
    if (timerDetails) {
      setFactoryId(factoryId)
      setLocationId(locationId)
      setPartId(partId)
      setSelectedOperator({
        id:
          typeof timerDetails?.operator === "object"
            ? (timerDetails?.operator._id as string)
            : "",
        name:
          typeof timerDetails?.operator === "object"
            ? `${timerDetails?.operator?.firstName} ${timerDetails?.operator?.lastName}`
            : "",
      })
    }
  }, [timerDetails])

  const filteredOperator =
    operatorQuery === ""
      ? users?.items?.slice(0, 15)
      : users?.items
          ?.filter((user) => {
            return (
              user.firstName
                .toLowerCase()
                .includes(operatorQuery.toLowerCase()) ||
              user.lastName.toLowerCase().includes(operatorQuery.toLowerCase())
            )
          })
          ?.slice(0, 15)

  useEffect(() => {
    if (
      (selectedOperator.id && !timerDetails?.operator) ||
      (selectedOperator.id &&
        typeof timerDetails?.operator === "object" &&
        selectedOperator.id !== timerDetails?.operator._id)
    ) {
      mutate({ ...timerDetails, operator: selectedOperator.id }, callBackReq)
    }
  }, [selectedOperator])

  return (
    <div className="order-last md:order-none mt-6 md:mt-0">
      <h4 className="uppercase text-sm text-gray-800 md:text-lg xl:text-[1.5vw] 2xl:text-3xl font-bold">
        Details
      </h4>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-3xl flex items-center gap-1 xl:leading-7">
        Factory:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.factoryId === "object"
                ? timerDetails?.factoryId.name
                : "---"}
            </>
          )}
        </span>
      </h5>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-3xl flex items-center gap-1 xl:leading-7">
        Machine:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.machineId === "object"
                ? timerDetails?.machineId.name
                : "---"}
            </>
          )}
        </span>
      </h5>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-3xl flex items-center gap-1 xl:leading-7">
        Product:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.partId === "object"
                ? timerDetails?.partId.name
                : "---"}
            </>
          )}
        </span>
      </h5>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-3xl flex items-center gap-1 xl:leading-7">
        Average Time:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.partId === "object"
                ? timerDetails?.partId.time
                : "---"}{" "}
              seconds
            </>
          )}
        </span>
      </h5>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-3xl flex items-center gap-1 xl:leading-7">
        Weight:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.partId === "object"
                ? timerDetails?.partId.tons.toFixed(6)
                : "---"}{" "}
              tons
            </>
          )}
        </span>
      </h5>
      <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
        Operator
      </h4>
      <Combobox
        as="div"
        value={selectedOperator}
        onChange={setSelectedOperator}
      >
        <div className="relative md:w-60 xl:w-80 2xl:w-[420px]">
          <Combobox.Input
            className={`block mt-2 md:w-60 xl:w-80 2xl:w-[420px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl sm:xl:leading-7 ${
              isUpdateTimerLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onChange={(event) => setOperatorQuery(event.target.value)}
            displayValue={(selected: { id: string; name: string }) => {
              return selected ? selected.name : ""
            }}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>

          {filteredOperator && filteredOperator.length > 0 ? (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 md:w-60 xl:w-80 2xl:w-[420px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOperator.map((item: T_User, index: number) => (
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
              ))}
            </Combobox.Options>
          ) : null}
        </div>
      </Combobox>
      <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
        Job
      </h4>
      <select
        id="jobs"
        name="jobs"
        disabled={isLoading || isTimerJobsLoading || isJobTimerLoading}
        defaultValue="Select Job"
        required
        value={jobTimer?.jobId as string}
        className={`block mt-2 w-full md:w-60 xl:w-80 2xl:w-[420px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm md:text-lg xl:text-[1.5vw] 2xl:text-3xl sm:xl:leading-7`}
      >
        <option value="">Select Job</option>
        {timerJobs?.items.map((item: T_Job, index: number) => {
          return (
            <option key={index} value={item._id as string}>
              {item.name}
            </option>
          )
        })}
        <option value="add">Add New Job</option>
      </select>
      <div className="relative flex">
        <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 md:text-lg xl:text-[1.5vw] 2xl:text-3xl">
          Readings
        </h4>
        <div className="absolute w-60 md:w-56 xl:w-[220px] 2xl:w-[272px] h-[1px] mt-[26px] md:mt-[32px] xl:mt-[29px] 2xl:mt-[51px] ml-20 md:ml-24 xl:ml-[99px] 2xl:ml-[145px] bg-gray-400"></div>
      </div>
      <div className="bg-gray-100 h-32 xl:h-40 2xl:h-56 mt-2 w-[321px] 2xl:w-[417px] p-2 text-gray-600 overflow-y-hidden">
        <h6 className="text-xs xl:text-[1.2vw] 2xl:text-2xl leading-5">
          Open the timer controller:
        </h6>
        <div className="text-xs xl:text-[1.2vw] 2xl:text-2xl leading-5">
          ------<span className="font-medium">OPERATIONS</span>------
        </div>
        {readingMessages.map((item, index) => {
          return (
            <p key={index} className="text-xs xl:text-sm 2xl:text-2xl">
              {item}
            </p>
          )
        })}
        <div ref={sectionDiv} />
      </div>
    </div>
  )
}

export default Details
