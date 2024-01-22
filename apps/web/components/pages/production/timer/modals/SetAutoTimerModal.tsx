import { Dialog, Transition } from "@headlessui/react"
import {
  T_AutoTimer,
  T_BackendResponse,
  T_Location,
  T_MachineClass,
} from "custom-validator"
import { ChangeEvent, Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useSetAutoTimer from "../../../../../hooks/autoTimer/useSetAutoTimer"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

interface SetAutoTimerModalProps {
  isOpen: boolean
  onClose: () => void
  locationId: string
  locationName: string
  machineClass: T_MachineClass
  item?: T_AutoTimer
}

export default function SetAutoTimerModalComponent({
  isOpen,
  onClose,
  locationId,
  locationName,
  machineClass,
  item,
}: SetAutoTimerModalProps) {
  const { mutate } = useSetAutoTimer()

  const [timeHVal, setTimeHVal] = useState<number>()
  const handleTimeHVal = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeHVal(parseInt(e.target.value))
  }
  const [timeMVal, setTimeMVal] = useState<number>()
  const handleTimeMVal = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeMVal(parseInt(e.target.value))
  }
  const [isPM, setIsPM] = useState<boolean>()
  const handlePM = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPM(e.target.checked)
  }

  const closeModal = () => {
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setTimeHVal(item?.timeH)
      setTimeMVal(item?.timeM)
      setIsPM(item?.isPM)
    }
  }, [isOpen, item])

  const queryClient = useQueryClient()

  const onSubmit = async () => {
    if (
      locationId === undefined ||
      machineClass._id === undefined ||
      timeHVal === undefined ||
      timeMVal === undefined
    ) {
      return false
    }
    if (timeHVal < 1 || timeHVal > 12) {
      toast.error("Hour value should be between 1 and 12")
      return false
    }
    if (timeMVal < 0 || timeMVal > 59) {
      toast.error("Hour value should be between 0 and 59")
      return false
    }
    mutate(
      {
        locationId,
        machineClassId: machineClass._id,
        timeH: timeHVal,
        timeM: timeMVal,
        isPM: isPM ?? false,
        isActive: true,
      },
      {
        onSuccess: (data: T_BackendResponse) => {
          if (!data.error) {
            queryClient.invalidateQueries({
              queryKey: ["auto-timers"],
            })
            closeModal()
          } else {
            toast.error(String(data.message))
          }
        },
        onError: (err: any) => {
          toast.error(String(err))
        },
      }
    )
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => {}}>
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

        <div className={`fixed inset-0 z-50 overflow-y-auto`}>
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
                <div className="bg-white">
                  <h3 className="px-4 py-3 text-lg font-semibold text-gray-800">
                    {locationName}
                    {" / "}
                    <span className="mr-4 text-red-700">
                      {machineClass.name == "Radial Press"
                        ? "RP and Variants"
                        : machineClass.name}{" "}
                    </span>
                    Auto-Timer
                  </h3>
                  <hr />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <input
                          value={timeHVal}
                          onChange={handleTimeHVal}
                          type="number"
                          className="p-1 text-lg rounded-lg focus:outline-none focus:shadow-none border-slate-300"
                          max={"12"}
                          min={"0"}
                        />
                        <div className="text-xl">:</div>
                        <input
                          value={timeMVal}
                          onChange={handleTimeMVal}
                          type="number"
                          className="p-1 text-lg rounded-lg focus:outline-none focus:shadow-none border-slate-300"
                          max={"60"}
                          min={"0"}
                        />
                        <label
                          htmlFor="Toggle4"
                          className="inline-flex items-center p-1 cursor-pointer"
                        >
                          <input
                            checked={isPM}
                            onChange={handlePM}
                            id="Toggle4"
                            type="checkbox"
                            className="hidden peer"
                          />
                          <span className="px-4 py-2 text-gray-800 bg-slate-300 peer-checked:bg-transparent peer-checked:text-gray-300">
                            AM
                          </span>
                          <span className="px-4 py-2 text-gray-300 bg-transparent peer-checked:bg-slate-300 peer-checked:text-gray-800">
                            PM
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={onSubmit}
                        className="px-2 py-1 text-white bg-green-700 rounded-lg"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={closeModal}
                        className="px-2 py-1 text-white bg-red-700 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
