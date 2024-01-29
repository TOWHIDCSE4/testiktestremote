import Image from "next/image"
import { ImBubbles2 } from "react-icons/im"
import { TimeDiffText } from "../../TimerContent"
import { useEffect, useMemo, useState } from "react"
import { HiX } from "react-icons/hi"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../../@/components/ui/popover"
import { Lato } from "next/font/google"
import { T_Device } from "custom-validator"
import DeviceInformationPopupComponent from "./device-information"
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin", "latin-ext"],
})

export default function ActiveDeviceItemComponent({
  item,
}: {
  item: T_Device
}) {
  const [open, setOpen] = useState<boolean>(false)
  const closePopover = () => {
    setOpen(false)
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
    console.log(item.history)
    if (item.history && typeof item.history == "object") {
      const tmp = new Date(item.history.startAt ?? 0).getTime()
      return tmp
    } else return 0
  }, [item.history])
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="relative flex items-center justify-between w-full gap-2 text-sm">
            <Image
              src={
                item.history &&
                typeof item.history == "object" &&
                item.history.userId &&
                typeof item.history.userId == "object" &&
                item.history.userId.profile?.photo
                  ? `/files/${item.history.userId.profile?.photo}`
                  : "/no-image.png"
              }
              width={24}
              height={24}
              className="object-cover w-6 h-6 rounded-full"
              alt=""
            />
            <div className="flex-1 font-semibold text-left line-clamp-1">
              {item.name}
            </div>
            <div className="flex items-center justify-end gap-2 text-xs">
              <div className="flex items-center gap-1 text-disabled">
                0
                <ImBubbles2 />
              </div>
              <TimeDiffText now={now} entry={entry} />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={`${lato.className} w-full p-2 bg-white border border-opacity-50 rounded-2xl border-disabled`}
        >
          <div className="w-[300px] font-lato text-primary-dark-blue">
            <button onClick={closePopover} className="absolute top-1 right-1">
              <HiX />
            </button>
            <div className="text-sm font-semibold uppercase">
              Device information
            </div>
            <DeviceInformationPopupComponent item={item} />
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
