import { useMemo } from "react"
import useDeviceTypes from "../../../../../hooks/device/useDeviceTypes"
import useDevices from "../../../../../hooks/device/useDevices"
import DeviceCategoryDropdownComponent from "./components/category-dropdown"
import DeviceItemViewComponent from "./components/item-view"
import { T_Device, T_DeviceType } from "custom-validator"

export default function DeviceListTabContent() {
  const { data: deviceTypes } = useDeviceTypes()
  const { data: devices } = useDevices()

  const classifiedDevices = useMemo<
    | {
        type: T_DeviceType
        devices: Array<T_Device>
      }[]
    | undefined
  >(() => {
    return deviceTypes?.items?.map((type) => ({
      type,
      devices:
        devices?.items?.filter(
          (item) =>
            typeof item.typeId == "object" && item.typeId._id == type._id
        ) ?? [],
    }))
  }, [devices, deviceTypes])

  return (
    <div className="text-xs">
      <p className="text-sm font-bold uppercase">Device Management</p>
      <p>Manage the device that is displayed to the company members.</p>
      <div className="mt-4">
        {classifiedDevices?.map((item) => (
          <DeviceCategoryDropdownComponent
            key={item.type._id}
            title={
              <span className="font-bold">
                {item.type.name}{" "}
                <span className="text-disabled">({item.devices.length})</span>
              </span>
            }
          >
            <div className="flex flex-col gap-2 py-4">
              {item.devices.map((device) => (
                <DeviceItemViewComponent
                  deviceType={item.type}
                  device={device}
                  key={device._id}
                />
              ))}
            </div>
          </DeviceCategoryDropdownComponent>
        ))}
      </div>
    </div>
  )
}
