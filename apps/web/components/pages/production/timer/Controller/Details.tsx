import { T_BackendResponse, T_Timer, T_User } from "custom-validator"
import React from "react"
import useUsers from "../../../../../hooks/users/useUsers"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import useUpdateTimer from "../../../../../hooks/timers/useUpdateTimer"

type T_Props = {
  timerDetails: T_Timer
  isLoading: boolean
  readingMessages: string[]
  sectionDiv: React.RefObject<HTMLDivElement>
}

const Details = ({
  timerDetails,
  isLoading,
  readingMessages,
  sectionDiv,
}: T_Props) => {
  const queryClient = useQueryClient()
  const { data: users, isLoading: isUsersLoading } = useUsers()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
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
  return (
    <div className="order-last md:order-none mt-6 md:mt-0">
      <h4 className="uppercase font-semibold text-sm text-gray-800 xl:text-lg 2xl:text-3xl">
        Details
      </h4>
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
        Factory:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
        Machine:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
        Part/Product:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
        Average Time:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
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
      <h5 className="uppercase text-sm font-medium text-gray-800 mt-2 xl:text-lg 2xl:text-3xl flex items-center gap-1">
        Weight:{" "}
        <span className="uppercase text-sm font-semibold text-gray-500 xl:text-lg 2xl:text-3xl">
          {isLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ) : (
            <>
              {typeof timerDetails?.partId === "object"
                ? timerDetails?.partId.pounds
                : "---"}{" "}
              lbs
            </>
          )}
        </span>
      </h5>
      <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 xl:text-lg 2xl:text-3xl">
        Operator
      </h4>
      <select
        id="user"
        name="user"
        disabled={isLoading || isUsersLoading || isUpdateTimerLoading}
        className="block mt-2 md:w-60 xl:w-80 2xl:w-[420px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm xl:text-lg 2xl:text-3xl sm:leading-6 disabled:opacity-70"
        defaultValue="Select User"
        required
        onChange={(e) => {
          if (e.target.value !== timerDetails?.operator) {
            mutate({ ...timerDetails, operator: e.target.value }, callBackReq)
          }
        }}
        value={timerDetails?.operator}
      >
        <option value="">Select User</option>
        {users?.items.map((item: T_User, index: number) => {
          return (
            <option key={index} value={item._id as string}>
              {item.firstName} {item.lastName}
            </option>
          )
        })}
      </select>
      <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 xl:text-lg 2xl:text-3xl">
        Job
      </h4>
      <select
        id="machine-part"
        name="machine-part"
        className={`block mt-2 w-full md:w-60 xl:w-80 2xl:w-[420px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm xl:text-lg 2xl:text-3xl sm:leading-6`}
      >
        <option>STOCK (SEGUIN) 30 TON MACHINE</option>
        <option>DC STOCK</option>
        <option>DC STOCK</option>
      </select>
      <div className="relative flex">
        <h4 className="uppercase font-semibold text-sm text-gray-800 mt-4 2xl:mt-8 xl:text-lg 2xl:text-3xl">
          Readings
        </h4>
        <div className="absolute w-60 xl:w-[234px] 2xl:w-[272px] h-[1px] mt-[25px] xl:mt-[32px] 2xl:mt-[51px] ml-20 xl:ml-[87px] 2xl:ml-[145px] bg-gray-400"></div>
      </div>
      <div className="bg-gray-100 h-32 xl:h-40 2xl:h-56 mt-2 w-[321px] 2xl:w-[417px] p-2 text-gray-600 overflow-y-hidden">
        <h6 className="text-xs xl:text-sm 2xl:text-2xl">
          Open the timer controller:
        </h6>
        <div className="text-xs xl:text-sm 2xl:text-2xl">
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
