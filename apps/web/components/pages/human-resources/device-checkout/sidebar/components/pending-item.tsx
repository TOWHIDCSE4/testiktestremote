import Image from "next/image"
import { HiX } from "react-icons/hi"
import { MouseEvent, useState } from "react"
import { T_BackendResponse, T_DeviceHistory } from "custom-validator"
import dayjs from "dayjs"
import {
  Popover,
  PopoverTrigger,
} from "../../../../../../@/components/ui/popover"
import { PopoverContent } from "@radix-ui/react-popover"
import { Lato } from "next/font/google"
import useApproveDeviceRequest from "../../../../../../hooks/device/useApproveDeviceRequest"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import useProfile from "../../../../../../hooks/users/useProfile"
import { USER_ROLES } from "../../../../../../helpers/constants"
import { useModalContext } from "../../context/modalContext"

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function PendingDeviceItemComponent({
  item,
}: {
  item: T_DeviceHistory
}) {
  const { mutate: approveDeviceRequest } = useApproveDeviceRequest()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const closePopover = () => {
    setOpen(false)
  }
  const triggerPopover = () => {
    setOpen((prev) => !prev)
  }
  const { openModal } = useModalContext()
  const onApprove = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.deviceId && typeof item.deviceId == "object")
      openModal({
        title: item.deviceId.name,
        description: `Are you sure you want to approve device check-${
          item.deviceId.status == "idle" ? "out" : "in"
        } request?`,
        callback: (res) => {
          if (res) {
            approveDeviceRequest(
              { id: item._id, cancel: false },
              {
                onSuccess: (data: T_BackendResponse) => {
                  queryClient.invalidateQueries({
                    queryKey: ["devices"],
                  })
                  queryClient.invalidateQueries({
                    queryKey: ["device-request-in"],
                  })
                  queryClient.invalidateQueries({
                    queryKey: ["device-request-out"],
                  })
                  queryClient.invalidateQueries({
                    queryKey: ["device-log", item._id],
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
        },
      })
  }
  const onDeny = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (item.deviceId && typeof item.deviceId == "object")
      openModal({
        title: item.deviceId.name,
        description: `Are you sure you want to reject device check-${
          item.deviceId.status == "idle" ? "out" : "in"
        } request?`,
        callback: (res) => {
          if (res) {
            approveDeviceRequest(
              { id: item._id, cancel: true },
              {
                onSuccess: (data: T_BackendResponse) => {
                  queryClient.invalidateQueries({
                    queryKey: ["devices"],
                  })
                  queryClient.invalidateQueries({
                    queryKey: ["device-request-in"],
                  })
                  queryClient.invalidateQueries({
                    queryKey: ["device-request-out"],
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
        },
      })
  }

  const { data: userProfile } = useProfile()
  const isAdmin = [
    USER_ROLES.Super,
    USER_ROLES.Administrator,
    USER_ROLES.HR,
    USER_ROLES.HR_Director,
  ].includes(userProfile?.item?.role ?? "")

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="relative flex items-center justify-between w-full gap-2 text-xs">
            <Image
              src={
                typeof item.userId == "object"
                  ? `/files/${item.userId.profile?.photo}` ?? "/no-image.png"
                  : "/no-image.png"
                // "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              width={24}
              height={24}
              className="object-cover w-6 h-6 rounded-full"
              alt=""
            />

            <button
              className="flex-1 font-semibold text-left"
              onClick={triggerPopover}
            >
              {typeof item.userId == "object"
                ? `${item.userId.firstName} ${item.userId.lastName}`
                : ""}
            </button>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button onClick={(e) => onApprove(e)} className="bg-none">
                  Approve
                </button>
                ||
                <button onClick={(e) => onDeny(e)} className="bg-none">
                  Deny
                </button>
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={`${lato.className} w-full z-50 p-2 bg-white border border-opacity-50 rounded-2xl border-disabled`}
        >
          <div className="relative z-50 w-[300px] font-lato text-primary-dark-blue">
            <button onClick={closePopover} className="absolute top-1 right-1">
              <HiX />
            </button>
            <div className="text-sm font-semibold uppercase">
              Check-{item.active ? "In" : "Out"} information
            </div>
            <div className="grid w-full grid-cols-2 gap-1 mt-2 text-2xs">
              <div className="flex flex-col">
                <div className="mr-2 font-black uppercase">Device Type:</div>
                <div>
                  {typeof item.deviceId == "object" &&
                  typeof item.deviceId.typeId == "object"
                    ? item.deviceId.typeId.name
                    : ""}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mr-2 font-black uppercase">Device Serial:</div>
                <div>
                  {typeof item.deviceId == "object" ? item.deviceId.sn : ""}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mr-2 font-black uppercase">Device Name:</div>
                <div>
                  {typeof item.deviceId == "object" ? item.deviceId.name : ""}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mr-2 font-black uppercase">Last Updated:</div>
                <div>
                  {typeof item.deviceId == "object"
                    ? dayjs(item.deviceId.lastUpdatedAt).format("YYYY-MM-DD")
                    : ""}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="mr-2 font-black uppercase">Request Date:</div>
                <div>{dayjs(item.createdAt).format("YYYY-MM-DD")}</div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
