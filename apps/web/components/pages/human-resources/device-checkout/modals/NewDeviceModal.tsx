import { Dialog, Transition } from "@headlessui/react"
import React, { useEffect, useState } from "react"
import useDeviceTypes from "../../../../../hooks/device/useDeviceTypes"
import toast from "react-hot-toast"
import useCreateDevice from "../../../../../hooks/device/useCreateDevice"
import { T_BackendResponse, T_Device } from "custom-validator"
import { useQueryClient } from "@tanstack/react-query"
import useUpdateDevice from "../../../../../hooks/device/useUpdateDevice"
import dayjs from "dayjs"
import { Calendar } from "../../../../../@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../@/components/ui/popover"
import { HiCalendar } from "react-icons/hi"

export default function NewDeviceModalComponent({
  isOpen,
  onClose,
  device,
}: {
  isOpen: boolean
  onClose: () => void
  device?: T_Device
}) {
  const { data: deviceTypes, isLoading } = useDeviceTypes()
  const { mutate: createDevice } = useCreateDevice()
  const { mutate: updateDevice } = useUpdateDevice()
  const [typeId, setTypeId] = useState<string>()
  const [name, setName] = useState<string>()
  const [sn, setSN] = useState<string>()
  const [note, setNote] = useState<string>()
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | undefined>(
    undefined
  )

  const closeModal = () => {
    setTypeId(undefined)
    setName(undefined)
    setSN(undefined)
    setNote(undefined)
    setLastUpdatedAt(undefined)
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setTypeId(
        typeof device?.typeId == "object" ? device.typeId._id : device?.typeId
      )
      setName(device?.name)
      setSN(device?.sn)
      setNote(device?.note)
      setLastUpdatedAt(device?.lastUpdatedAt)
    }
  }, [isOpen, device])

  const queryClient = useQueryClient()

  const onSubmit = async () => {
    if (!typeId || !name || !sn) {
      return toast.error(`Please type all required fields`)
    }
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["devices"],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-log", device ? device._id : undefined],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-log"],
          })
          toast.success(String(data.message))
          closeModal()
        } else {
          toast.error(String(data.message))
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    device
      ? updateDevice(
          {
            name,
            typeId,
            sn,
            note,
            _id: device._id,
            lastUpdatedAt,
          },
          callBackReq
        )
      : createDevice({ name, typeId, sn, note, lastUpdatedAt }, callBackReq)
  }

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className={"relative z-50"} onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
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
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={
                  "relative transform rounded-lg overflow-hidden bg-white shadow-xl transition-all w-full sm:max-w-[34rem]"
                }
              >
                <div className="flex items-center bg-gold text-white uppercase rounded-t-lg justify-between h-28 m-[0.2rem] p-8 border-dark-blue border-b-8">
                  <h3 className="text-2xl tracking-wider">New Device</h3>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-white">
                  <div className="grid grid-cols-12 gap-2">
                    <label className="flex items-center justify-end col-span-3">
                      Device Type
                    </label>
                    <select
                      className="col-span-9 p-2 border rounded-sm border-slate-400 focus:outline-none"
                      placeholder="Select Device Type"
                      onChange={(e) => setTypeId(e.target.value)}
                    >
                      {deviceTypes?.items?.map((item, idx) => (
                        <option
                          key={idx}
                          value={item._id}
                          selected={item._id == typeId}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <label className="flex items-center justify-end col-span-3">
                      Device Name
                    </label>
                    <input
                      type="text"
                      value={name ?? ""}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-9 p-2 border rounded-sm border-slate-400 focus:outline-none"
                      placeholder="Type Device Name"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <label className="flex items-center justify-end col-span-3">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      value={sn ?? ""}
                      maxLength={12}
                      onChange={(e) => setSN(e.target.value)}
                      className="col-span-9 p-2 border rounded-sm border-slate-400 focus:outline-none"
                      placeholder="Type Device Serial Number"
                    />
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <label className="flex items-center justify-end col-span-3">
                      Last Updated
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`
                            flex items-center justify-start text-left font-normal col-span-9 p-2 border rounded-sm border-slate-400 focus:outline-none",
                            ${lastUpdatedAt ? "" : `text-muted-foreground`}`}
                        >
                          <HiCalendar className="w-4 h-4 mr-2" />
                          {lastUpdatedAt ? (
                            dayjs(lastUpdatedAt).format("YYYY-MM-DD")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={lastUpdatedAt}
                          onSelect={setLastUpdatedAt}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <label className="flex items-center justify-end col-span-3">
                      Details
                    </label>
                    <textarea
                      value={note ?? ""}
                      onChange={(e) => setNote(e.target.value)}
                      className="col-span-9 p-2 border rounded-sm border-slate-400 focus:outline-none"
                      placeholder="Type Device Details"
                    ></textarea>
                  </div>
                </div>
                <hr></hr>
                <div className="flex justify-end gap-2 px-4 py-8 bg-gray-50 sm:px-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center w-full h-6 text-sm font-semibold text-white uppercase bg-red-700 rounded-md shadow-sm px-9 hover:bg-red-600 sm:ml-3 disabled:opacity-70 sm:w-auto"
                    onClick={() => {
                      onSubmit()
                    }}
                  >
                    {device ? `Update` : `Add`}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full h-6 px-6 text-sm font-semibold text-white uppercase bg-gray-400 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-300 sm:mt-0 sm:w-auto disabled:opacity-70"
                    onClick={() => {
                      onClose()
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
