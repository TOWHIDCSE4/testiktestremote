import { useEffect, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../../../@/components/ui/collapsible"
import { HiChevronRight, HiX } from "react-icons/hi"
import Image from "next/image"
import { T_BackendResponse, T_Device, T_DeviceType } from "custom-validator"
import dayjs from "dayjs"
import NewDeviceModalComponent from "../../modals/NewDeviceModal"
import useUpdateDevice from "../../../../../../hooks/device/useUpdateDevice"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import useDeviceLogs from "../../../../../../hooks/device/useDeviceLogs"
import DeviceLogsTableComponent from "./log-table"
import useRemoveDevice from "../../../../../../hooks/device/useRemoveDevice"

export default function DeviceItemViewComponent({
  device,
  deviceType,
}: {
  device: T_Device
  deviceType: T_DeviceType
}) {
  const queryClient = useQueryClient()
  const { mutate: updateDevice } = useUpdateDevice()
  const { data: deviceLogs } = useDeviceLogs(device._id)

  const [open, setOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  useEffect(() => {
    if (open) {
      queryClient.invalidateQueries({
        queryKey: ["device-log", device._id],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, device._id])
  const onClose = () => {
    setOpen(false)
  }
  const onEditClick = () => {
    setIsEditModalOpen(true)
  }
  const onDisableClick = () => {
    updateDevice(
      {
        _id: device._id,
        status: device.status == "disabled" ? "idle" : "disabled",
        name: device.name,
        sn: device.sn,
        typeId: device.typeId,
      },
      {
        onSuccess: (data: T_BackendResponse) => {
          queryClient.invalidateQueries({
            queryKey: ["devices"],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-log", device._id],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-log"],
          })
          if (!data.error) {
            toast.success(String(data.message))
          } else {
            toast.error(String(data.message))
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast.error(String(error.message))
        },
      }
    )
  }
  const { mutate: removeDevice } = useRemoveDevice()
  const onRemoveClick = () => {
    if (
      confirm(
        `Are you sure you want to remove this device: ${device.name} ?`
      ) === true
    ) {
      removeDevice(
        { id: device._id },
        {
          onSuccess: (data: T_BackendResponse) => {
            queryClient.invalidateQueries({
              queryKey: ["devices"],
            })
            queryClient.invalidateQueries({
              queryKey: ["device-log", device._id],
            })
            queryClient.invalidateQueries({
              queryKey: ["device-log"],
            })
            if (!data.error) {
              toast.success(String(data.message))
            } else {
              toast.error(String(data.message))
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            toast.error(String(error.message))
          },
        }
      )
    } else {
      return false
    }
  }

  return (
    <div className="py-2 CollapsibleContent">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className={`flex pl-2 text-xs justify-between w-full uppercase items-center gap-1`}
        >
          <HiChevronRight
            className={`text-lg transition-all ${open ? "rotate-90" : ""}`}
          />
          <div
            className={`flex-1 text-left line-clamp-1 ${
              device.status == "disabled" ? "line-through text-disabled" : ""
            }`}
          >
            {device.name}
          </div>
          <div className="self-end text-2xs text-disabled">{device.sn}</div>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <div className="relative w-full p-2 bg-white border rounded-2xl border-disabled">
            <button
              onClick={onClose}
              className="absolute bg-none right-2 top-2"
            >
              <HiX />
            </button>
            <p className="text-sm font-semibold">{device.name}</p>
            <div className="flex w-full gap-2 py-2">
              <div className="flex items-start flex-1">
                <Image
                  className="w-full border rounded-lg border-slate-400"
                  width={300}
                  height={150}
                  alt="image"
                  src={deviceType.image ?? "/no-image.png"}
                />
              </div>
              <div className="flex flex-col text-2xs">
                <div className="flex items-center gap-1">
                  <div className="font-bold uppercase">Device Added :</div>
                  <div>
                    {device.addedAt
                      ? dayjs(device.addedAt).format("MM/DD/YY")
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="font-bold uppercase">Type :</div>
                  <div>{deviceType.name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="font-bold uppercase">Name :</div>
                  <div className="line-clamp-1">{device.name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="font-bold uppercase">Serial :</div>
                  <div>{device.sn}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="font-bold uppercase">Last Updated :</div>
                  <div>
                    {device.lastUpdatedAt
                      ? dayjs(device.lastUpdatedAt).format("MM/DD/YY")
                      : "N/A"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="font-bold uppercase">Added By :</div>
                  <div>
                    {device.userId
                      ? typeof device.userId == "object"
                        ? device.userId.firstName + " " + device.userId.lastName
                        : ""
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <DeviceLogsTableComponent
              pageSize={10}
              logs={deviceLogs?.items}
              height="200px"
            />
            <hr className="my-2" />
            <div className="flex items-center justify-between w-full">
              <button
                onClick={onDisableClick}
                className={`px-2 py-1 text-white uppercase ${
                  device.status == "disabled" ? "bg-indigo-blue" : "bg-red-700"
                } rounded-lg text-2xs`}
              >
                {device.status == "disabled" ? "Recommission" : "Decommission"}
              </button>
              {!device.history &&
                !device.lastUserId &&
                device.status !== "using" && (
                  <button
                    onClick={onRemoveClick}
                    className="px-2 py-1 text-white uppercase bg-red-700 rounded-lg text-2xs"
                  >
                    Remove
                  </button>
                )}
              <button
                onClick={onEditClick}
                className="px-2 py-1 text-white uppercase rounded-lg text-2xs bg-indigo-blue"
              >
                Edit Device
              </button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <NewDeviceModalComponent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
        }}
        device={device}
      />
    </div>
  )
}
