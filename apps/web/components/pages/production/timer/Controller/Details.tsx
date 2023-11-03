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
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { Combobox } from "@headlessui/react"
import useUpdateTimerJob from "../../../../../hooks/jobTimer/useUpdateJobTimer"
import NewJobModal from "../../../order-flow/production-tracker/modals/NewModal"
import useProfile from "../../../../../hooks/users/useProfile"
import { useSocket } from "../../../../../store/useSocket"

type T_Props = {
  timerDetails: T_Timer // Show all details of controller
  isTimerDetailDataLoading: boolean // Loadind timer details
  readingMessages: string[] // Using for messages
  sectionDiv: React.RefObject<HTMLDivElement>
  jobTimer: T_JobTimer // Timer jobs list
  jobUpdateId: string
  defaultOperator: any
  isJobTimerLoading: boolean // Timer jobs list loading
  isCycleClockRunning: boolean // Tracker run loading
  timerJobs: T_Job[] | undefined
  setFactoryId: React.Dispatch<React.SetStateAction<string>>
  setLocationId: React.Dispatch<React.SetStateAction<string>>
  setPartId: React.Dispatch<React.SetStateAction<string>>
  isTimerJobsLoading: boolean
  isJobSwitch: boolean
  setIsJobSwitch: React.Dispatch<React.SetStateAction<boolean>>
}

const Details = ({
  timerDetails,
  isTimerDetailDataLoading,
  readingMessages,
  sectionDiv,
  jobTimer,
  jobUpdateId,
  defaultOperator,
  isJobTimerLoading,
  isCycleClockRunning,
  timerJobs,
  setFactoryId,
  setLocationId,
  setPartId,
  isTimerJobsLoading,
  isJobSwitch,
  setIsJobSwitch,
}: T_Props) => {
  const queryClient = useQueryClient()
  let socket = useSocket((store) => store.instance)
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const isComboboxDisabled = isCycleClockRunning
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
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const { mutate: updateTimerJob, isLoading: isUpdateTimerJobLoading } =
    useUpdateTimerJob()
  const [operatorQuery, setOperatorQuery] = useState("")
  const [openNewJobModal, setOpenNewJobModal] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState({
    id: "",
    name: "",
  })

  const [operator, setOperator] = useState({
    id: "",
    name: "",
  })

  const handleInputOperator = () => {
    const leadingTrailingSpaceRegex = /^\s|\s$/
    if (leadingTrailingSpaceRegex.test(operatorQuery)) {
      toast.error("Please remove trailing spaces")
    } else {
      mutate(
        { ...timerDetails, operator: "", operatorName: operatorQuery },
        callBackReq
      )
    }
  }

  useEffect(() => {
    if (isJobSwitch) {
      updateTimerJob({ ...jobTimer, jobId: jobUpdateId }, callBackReq)
      toast.success("Job switch succesfully", {
        duration: 5000,
      })
      setIsJobSwitch(false)
    }
  }, [isJobSwitch])

  useEffect(() => {
    if (defaultOperator) {
      setSelectedOperator({
        id: defaultOperator._id,
        name: defaultOperator.firstName + " " + defaultOperator.lastName,
      })
      setOperator({
        id: defaultOperator._id,
        name: defaultOperator.firstName + " " + defaultOperator.lastName,
      })
      mutate({ ...timerDetails, operator: defaultOperator._id }, callBackReq)
    }
  }, [defaultOperator])

  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timer", timerDetails._id],
        })
        queryClient.invalidateQueries({
          queryKey: ["job-timer-timer"],
        })
        socket?.emit("change-job", {
          action: "change-job",
          timerId: timerDetails._id,
          jobInfo: data?.item,
        })
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
          typeof timerDetails?.operator === "object" &&
          timerDetails?.operator != null &&
          timerDetails?.operator != undefined
            ? (timerDetails?.operator?._id as string)
            : "",
        name:
          typeof timerDetails?.operator === "object" &&
          timerDetails?.operator != null &&
          timerDetails?.operator != undefined
            ? `${timerDetails?.operator?.firstName} ${timerDetails?.operator?.lastName}`
            : "",
      })
    }
  }, [timerDetails])

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
    <div className="order-last h-[40rem] md:order-none md:mt-0 2xl:mt-0">
      <h4 className="uppercase text-sm text-gray-800 md:text-lg xl:text-[1.5vw] 2xl:text-2xl font-bold  dark:bg-dark-blue dark:text-white">
        Details
      </h4>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-2xl flex items-center gap-1 xl:leading-7  dark:bg-dark-blue dark:text-white">
        Factory:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
          {isTimerDetailDataLoading ? (
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-2xl flex items-center gap-1 xl:leading-7  dark:bg-dark-blue dark:text-white">
        Machine:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
          {isTimerDetailDataLoading ? (
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-2xl flex items-center gap-1 xl:leading-7  dark:bg-dark-blue dark:text-white">
        Product:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
          {isTimerDetailDataLoading ? (
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-2xl flex items-center gap-1 xl:leading-7  dark:bg-dark-blue dark:text-white">
        Average Time:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
          {isTimerDetailDataLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.partId === "object"
                ? parseInt(timerDetails?.partId.time.toString())
                : "---"}{" "}
              seconds
            </>
          )}
        </span>
      </h5>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 md:text-lg xl:text-[1.5vw] 2xl:text-2xl flex items-center gap-1 xl:leading-7  dark:bg-dark-blue dark:text-white">
        Weight:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
          {isTimerDetailDataLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.partId === "object"
                ? timerDetails?.partId.tons.toFixed(3)
                : "---"}{" "}
              tons
            </>
          )}
        </span>
      </h5>
      <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-3 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
        Operator
      </h4>
      <Combobox
        as="div"
        value={selectedOperator}
        onChange={setSelectedOperator}
        disabled={isComboboxDisabled}
      >
        <div className="relative xl:w-80 ipadair:w-[250px] 2xl:w-[350px]">
          <Combobox.Input
            className={`block mt-2 w-full xl:w-80 2xl:w-[350px] ipadair:w-[250px] rounded-md border-0 py-1.5 pl-3 dark:bg-gray-300 bg-zinc-100 pr-10 text-gray-900 ring-1 ring-inset ring-gray-400 focus:ring-1 focus:ring-blue-950 sm:text-sm md:text-lg xl:text-[1.5vw] 2xl:text-xl sm:xl:leading-7 disabled:opacity-50 disabled:cursor-not-allowed`}
            onChange={(event) => setOperatorQuery(event.target.value)}
            displayValue={(selected: { id: string; name: string }) => {
              return selected ? selected.name : ""
            }}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className={`h-5 w-5 ${
                isUpdateTimerLoading ? "text-gray-400" : "text-gray-600"
              }`}
              aria-hidden="true"
            />
          </Combobox.Button>
          {operatorQuery && (
            <Combobox.Button
              className="absolute inset-y-0 right-5 flex items-center rounded-r-md px-2 focus:outline-none"
              onClick={() => handleInputOperator()}
            >
              <span className="flex justify-start items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.7"
                  stroke="currentColor"
                  className={`h-5 w-6 ${
                    isUpdateTimerLoading ? "text-gray-400" : "text-gray-600"
                  } mx-2`}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              </span>
            </Combobox.Button>
          )}

          {filteredOperator && filteredOperator.length > 0 ? (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 xl:w-80 ipadair:w-[250px] 2xl:w-[350px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
      <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-3 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
        Job
      </h4>
      <select
        id="jobs"
        name="jobs"
        disabled={
          isTimerDetailDataLoading ||
          isTimerJobsLoading ||
          isJobTimerLoading ||
          isUpdateTimerJobLoading
        }
        required
        value={jobUpdateId}
        className={`block mt-2 w-full xl:w-80 ipadair:w-[250px] 2xl:w-[350px] rounded-md border-0 py-1.5 pl-3 pr-10 dark:bg-gray-300 bg-zinc-100 text-gray-900 ring-1 ring-inset ring-gray-400 focus:ring-1 focus:ring-blue-950 sm:text-sm md:text-lg xl:text-[1.5vw] 2xl:text-1xl sm:xl:leading-7`}
        onChange={(e) => {
          if (e.target.value === "Add New Job") {
            setOpenNewJobModal(true)
          } else {
            updateTimerJob({ ...jobTimer, jobId: e.target.value }, callBackReq)
          }
        }}
      >
        <option value="">Select Job</option>
        {timerJobs?.map((item: T_Job, index: number) => {
          return (
            <option key={index} value={item._id as string}>
              {item.name}
            </option>
          )
        })}
        <option>Add New Job</option>
      </select>
      <div className="relative flex">
        <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-3 md:text-lg xl:text-[1.5vw] 2xl:text-2xl  dark:bg-dark-blue dark:text-white">
          Readings
        </h4>
        <div className="absolute w-60 md:w-[9.5rem] xl:w-[220px] 2xl:w-[200px] dark:bg-gray-300 h-[1px] mt-[26px] md:mt-[32px] xl:mt-[29px] 2xl:mt-[30px] ml-20 md:ml-24 xl:ml-[99px] 2xl:ml-[145px] bg-gray-400 "></div>
      </div>
      <div className="bg-gray-100 h-28 xl:h-30 2xl:h-28 ipadair:w-[250px] mt-2 w-[321px] 2xl:w-[350px] p-2 dark:bg-gray-300 text-gray-800 overflow-auto">
        <h6 className="text-xs xl:text-[1.2vw] 2xl:text-lg leading-5  ">
          Open the timer controller:
        </h6>
        <div className="text-xs xl:text-[1.2vw] 2xl:text-lg leading-5 ">
          ------<span className="font-medium">OPERATIONS</span>------
        </div>
        {readingMessages.map((item, index) => {
          return (
            <p key={index} className="text-md xl:text-lg 2xl:text-md">
              {item}
            </p>
          )
        })}
        <div ref={sectionDiv} />
      </div>
      <NewJobModal
        isOpen={openNewJobModal}
        locationState={
          typeof timerDetails?.locationId === "object" &&
          timerDetails?.locationId._id
            ? timerDetails?.locationId.name
            : "Loading..."
        }
        locationId={locationId}
        onClose={() => setOpenNewJobModal(false)}
        jobTimer={jobTimer}
        partId={partId}
        timerDetails={timerDetails}
        timer={true}
      />
    </div>
  )
}

export default Details
