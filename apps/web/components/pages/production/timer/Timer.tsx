import {
  T_BackendResponse,
  T_Machine,
  T_MachineClass,
  T_Part,
  T_Timer,
  T_User,
} from "custom-validator"
import React, { Dispatch } from "react"
import useUpdateTimer from "../../../../hooks/timers/useUpdateTimer"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

type T_Props = {
  timer: T_Timer
  machineClass: T_MachineClass
  isLoading: boolean
  setSelectedTimerId: Dispatch<string>
  setOpenDetailsModal: Dispatch<boolean>
  setOpenDeleteModal: Dispatch<boolean>
  machine: T_Machine
  operator: T_User
}

const Timer = ({
  timer,
  machineClass,
  isLoading,
  setSelectedTimerId,
  setOpenDetailsModal,
  setOpenDeleteModal,
  machine,
  operator,
}: T_Props) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading: isUpdateTimerLoading } = useUpdateTimer()
  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timers-location"],
        })
        queryClient.invalidateQueries({
          queryKey: ["timer", timer._id],
        })
        toast.success("Timer part has been updated")
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }
  const openController = () => {
    window.open(
      `/production/timer/${timer._id}/controller`,
      "Timer Controller",
      "location,status,scrollbars,resizable,width=1024, height=800"
    )
  }
  return (
    <div
      key={timer._id as string}
      className="bg-white rounded-md border border-gray-200 drop-shadow-lg"
    >
      <div className="px-4 py-4 border-b border-gray-200">
        <select
          id="part"
          name="part"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6"
          defaultValue={
            typeof timer.partId === "string" && timer.partId ? timer.partId : ""
          }
          disabled={isLoading || isUpdateTimerLoading}
          onChange={(e) => {
            if (e.target.value !== timer.partId) {
              mutate({ ...timer, partId: e.target.value }, callBackReq)
            }
          }}
        >
          <option value={""} disabled>
            Select Part
          </option>
          {timer?.parts?.map((item: T_Part, index: number) => {
            if (item.machineClassId === machineClass._id) {
              return (
                <option key={index} value={item._id as string}>
                  {item.name}
                </option>
              )
            } else {
              return null
            }
          })}
        </select>
      </div>
      <div className="px-4 py-4 text-center space-y-2">
        <h3 className="text-gray-700 font-bold uppercase text-xl">
          {machine?.name}
        </h3>
        <h1 className="font-bold text-stone-400 text-5xl">00:00:00</h1>
        <p className="text-amber-600">
          {operator
            ? `${operator?.firstName} ${operator?.lastName}`
            : "Please select operator"}
        </p>
        <div>
          <h2 className="font-semibold text-gray-400 text-3xl">000</h2>
          <h6 className="text-gray-700 font-semibold uppercase text-sm">
            Daily Units
          </h6>
        </div>
      </div>
      <div className="px-4">
        <div className="flex justify-between text-gray-900">
          <span>Total Tons:</span>
          <span>0.000</span>
        </div>
        <div className="flex justify-between text-gray-900">
          <span>Average Ton/hr:</span>
          <span>0.000</span>
        </div>
        <div className="flex justify-between text-gray-900">
          <span>Average Unit/hr:</span>
          <span>0.000</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 px-4 my-4">
        <button
          className="uppercase text-sm text-white bg-green-800 p-1 rounded-md"
          onClick={openController}
        >
          Controller
        </button>
        <button
          className="uppercase text-sm text-white bg-stone-300 p-1 rounded-md"
          onClick={() => alert("Coming soon...")}
        >
          Live Camera
        </button>
        <button
          className="uppercase disabled:opacity:70 text-sm text-white bg-blue-950 p-1 rounded-md"
          onClick={() => {
            setSelectedTimerId(timer._id as string)
            setOpenDetailsModal(true)
          }}
        >
          Details
        </button>
        <button
          className="uppercase text-sm text-white bg-red-600 p-1 rounded-md"
          onClick={() => {
            setSelectedTimerId(timer._id as string)
            setOpenDeleteModal(true)
          }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default Timer
