import { useState } from "react"
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

export default function IdleDeviceItemComponent({ item }: { item: T_Device }) {
  const [open, setOpen] = useState<boolean>(false)
  const closePopover = () => {
    setOpen(false)
  }
  const triggerPopover = () => {
    setOpen((prev) => !prev)
  }
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <div className="relative flex items-center justify-between w-full gap-2 pl-4 text-sm">
            <button
              onClick={triggerPopover}
              className="flex-1 font-semibold text-left line-clamp-1"
            >
              {item.name}
            </button>
            <div className="flex items-center justify-end gap-2 text-xs text-disabled">
              {item.sn}
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
