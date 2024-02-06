"use client"
import { Popover } from "antd"
import { useState } from "react"
import { LuSettings2 } from "react-icons/lu"
import DefaultLocations from "./DefaultLocations"
import DefaultMachineClasses from "./DefaultMachineClasses"
import ProductionEyeDesktopMode from "./ProductionEyeDesktopMode"
import ProductionEyeMobileMode from "./ProductionEyeMobileMode"

const ProductionEyeSettings: React.FC = () => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Popover
      content={
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-1">
            <h2 className="font-semibold">View mode</h2>
            <div className="flex items-center justify-around w-full space-x-1">
              <ProductionEyeMobileMode />
              <ProductionEyeDesktopMode />
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <h2 className="font-semibold">Default Location</h2>
            <DefaultLocations />
            <h2 className="font-semibold">Default Machine Classes</h2>
            <DefaultMachineClasses />
          </div>
        </div>
      }
      //   title="View Mode"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottom"
      rootClassName="w-52 h-60 overflow-y-auto"
    >
      <button className="flex items-center justify-center w-6 h-6 text-sm text-white bg-black rounded-lg">
        <LuSettings2 />
      </button>
    </Popover>
  )
}

export default ProductionEyeSettings
