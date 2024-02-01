"use client"
import { Checkbox, Popover } from "antd"
import { T_MachineClass } from "custom-validator"
import { useState } from "react"
import { LuSettings2 } from "react-icons/lu"
import useLocations from "../../../hooks/locations/useLocations"
import useMachineClasses from "../../../hooks/machineClasses/useMachineClasses"
import ProductionEyeDesktopMode from "./ProductionEyeDesktopMode"
import ProductionEyeMobileMode from "./ProductionEyeMobileMode"

const ProductionEyeSettings: React.FC = () => {
  const [open, setOpen] = useState(false)

  const { data: locations } = useLocations()
  const { data: machineClasses } = useMachineClasses()

  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const onChangeLocations = (checkedValues: any) => {
    console.log("checked locations = ", checkedValues)
  }
  const onChangeMachineClass = (checkedValues: any) => {
    console.log("checked machine classes = ", checkedValues)
  }

  const locationsCheckboxes = locations?.items.map((item) => ({
    label: item.name,
    value: item._id as string,
  }))

  const machineClassesCheckboxes = machineClasses?.items.map(
    (item: T_MachineClass) => ({
      label: item.name,
      value: item._id as string,
    })
  )

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
            <Checkbox.Group
              options={locationsCheckboxes}
              //   defaultValue={["array_of_ids"]}
              onChange={onChangeLocations}
              rootClassName="flex flex-col"
            />
            <h2 className="font-semibold">Default Machine Classes</h2>
            <Checkbox.Group
              options={machineClassesCheckboxes}
              //   defaultValue={["array_of_ids"]}
              onChange={onChangeMachineClass}
              rootClassName="flex flex-col "
            />
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
