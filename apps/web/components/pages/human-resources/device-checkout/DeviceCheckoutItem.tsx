import { HiChevronDown } from "react-icons/hi"
import {
  Collapsible,
  CollapsibleContent,
} from "../../../../@/components/ui/collapsible"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import useProfile from "../../../../hooks/users/useProfile"
import { TimeDiffText } from "./TimerContent"
import { T_BackendResponse, T_Device } from "custom-validator"
import dayjs from "dayjs"
import useDeviceCheckinRequests from "../../../../hooks/device/useDeviceCheckinRequests"
import { useQueryClient } from "@tanstack/react-query"
import useCreateDeviceRequest from "../../../../hooks/device/useCreateDeviceRequest"
import toast from "react-hot-toast"

export default function DeviceCheckoutItemComponent({
  item,
}: {
  item: T_Device
}) {
  const { data: deviceCheckinRequests } = useDeviceCheckinRequests()
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false)
  const { data: userProfile } = useProfile()

  const deviceType = typeof item.typeId == "object" ? item.typeId : null
  const history = typeof item.history == "object" ? item.history : null
  const approvedBy =
    item.history &&
    typeof item.history == "object" &&
    typeof item.history.approvedBy == "object"
      ? item.history.approvedBy
      : null

  const isAlreadyRequested = useMemo<boolean>(() => {
    if (!deviceCheckinRequests?.items) {
      return false
    }
    if (
      deviceCheckinRequests.items.some(
        (request) =>
          typeof request.deviceId == "object" &&
          request.deviceId._id == item._id
      )
    )
      return true
    return false
  }, [deviceCheckinRequests?.items, item._id])

  const isSubmitDisabled = useMemo<boolean>(() => {
    return item.status !== "using"
  }, [item.status])

  const queryClient = useQueryClient()
  const { mutate: createDeviceRequest } = useCreateDeviceRequest()
  const onSubmit = () => {
    createDeviceRequest(
      {
        deviceId: item._id,
        type: "in",
      },
      {
        onSuccess: (data: T_BackendResponse) => {
          queryClient.invalidateQueries({
            queryKey: ["device-request-in"],
          })
          queryClient.invalidateQueries({
            queryKey: ["device-request-out"],
          })
          queryClient.invalidateQueries({
            queryKey: ["devices"],
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

  const [now, setNow] = useState<number>(new Date().getTime())

  useEffect(() => {
    const tmp = setInterval(() => {
      setNow(new Date().getTime())
    }, 1000)
    return () => {
      clearInterval(tmp)
    }
  }, [])
  const entry = useMemo(() => {
    if (item.history && typeof item.history == "object") {
      const tmp = new Date(item.history.startAt ?? 0).getTime()
      return tmp
    } else return 0
  }, [item.history])

  return (
    <div className="text-[0.7rem]">
      <div className="grid grid-cols-1 py-2 md:grid-cols-2 gap-y-4">
        <div className="flex flex-col items-start">
          <p className="text-xs font-bold uppercase">
            {deviceType?.name ?? "undefined"}
          </p>
          <p className="pl-2 text-4xl">{item.name}</p>
        </div>
        <div className="flex flex-col md:items-end">
          <p className="text-xs font-semibold uppercase text-disabled">
            Total Time Checked Out
          </p>
          <div className="flex justify-between text-4xl border-b border-disabled">
            <TimeDiffText now={now} entry={entry} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 py-2 md:grid-cols-2">
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-4 pt-4 pl-4">
            <p>
              <span className="font-bold uppercase">
                Date Checked Out :{` `}
              </span>
              <span className="text-disabled">
                {history
                  ? dayjs(history.startAt).format("YYYY-MM-DD")
                  : "undefined"}
              </span>
            </p>
            <p>
              <span className="font-bold uppercase">Serial Number :{` `}</span>
              <span className="text-disabled">{item.sn}</span>
            </p>
            <p>
              <span className="font-bold uppercase">Approved By :{` `}</span>
              <span className="text-disabled">
                {approvedBy
                  ? `${approvedBy.firstName} ${approvedBy.lastName}`
                  : "undefined"}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col md:items-end">
          <div className="flex flex-col gap-4 pt-4 pl-4">
            <p>
              <span className="font-bold uppercase">
                Time Checked Out :{` `}
              </span>
              <span className="text-disabled">
                {history
                  ? dayjs(history.startAt).format("HH:mm:ss")
                  : "undefined"}
              </span>
            </p>
            <p>
              <span className="font-bold uppercase">Location :{` `}</span>
              <span className="text-disabled">
                {typeof history?.locationId == "object"
                  ? history.locationId.name
                  : "undefined"}
              </span>
            </p>
            <p>
              <span className="font-bold uppercase">Last Updated :{` `}</span>
              <span className="text-disabled">
                {dayjs(item.lastUpdatedAt).format("MM/DD/YY")}
              </span>
            </p>
          </div>
          <div className="flex justify-end pr-4 mt-4">
            <button
              disabled={isSubmitDisabled}
              onClick={onSubmit}
              className="px-4 py-2 text-[0.7rem] text-white uppercase rounded-md shadow-sm disabled:bg-gray-400 bg-gold"
            >
              {isAlreadyRequested ? "Cancel Check-In Request" : "Check-In"}
            </button>
          </div>
        </div>
      </div>
      <div>
        <p className="pl-2">Comments</p>
        <div className="relative w-full">
          <button
            onClick={() => {
              setIsCommentsOpen((prev) => !prev)
            }}
            className="absolute top-0 left-0 -translate-x-full"
          >
            <HiChevronDown
              data-open={isCommentsOpen}
              className="transition-transform -mt-[4px] -mr-[4px] data-[open=false]:-mt-[6px] data-[open=false]:-rotate-90"
            />
          </button>
          <div className="w-full border-t border-primary-dark-blue"></div>
        </div>
        <div>
          <Collapsible open={isCommentsOpen}>
            <CollapsibleContent className="CollapsibleContent">
              <div className="pl-2">
                <p className="my-2 ml-10 font-black uppercase">Your Reply</p>
                <div className="flex gap-4">
                  <Image
                    width={30}
                    height={30}
                    className="object-cover w-6 h-6 rounded-full"
                    alt="avatar"
                    src={
                      userProfile?.item?.profile?.photo
                        ? `/files/${userProfile?.item?.profile?.photo}`
                        : "/no-image.png"
                    }
                  />
                  <div className="relative flex flex-1 overflow-hidden bg-white border rounded-sm border-disabled">
                    <div className="relative flex-1">
                      <textarea
                        className="w-full min-h-full p-2 focus:outline-none"
                        rows={5}
                      ></textarea>
                    </div>
                    <div className="flex items-center justify-center p-2 border-l border-disabled border-opacity-30">
                      <button className="px-2 py-1 text-[0.7rem] text-white uppercase rounded-md shadow-sm disabled:bg-gray-400 bg-indigo-blue">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2">
                <p className="mb-2 text-xl font-bold uppercase">2 Comments</p>
                <div className="flex gap-2">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    width={300}
                    height={300}
                    className="object-cover w-6 h-6 rounded-full"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-black">Rocky Lorenz</p>
                    <p>Can I use your headset next weekend?</p>
                    <p className="text-2xs">
                      <span className="mr-2 text-disabled">on</span>
                      <span className="font-black underline">Device Name</span>
                    </p>
                    <p className="text-2xs text-disabled">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}
