import { useMemo } from "react"
import useDeviceCheckinRequests from "../../../../../hooks/device/useDeviceCheckinRequests"
import useDeviceTypes from "../../../../../hooks/device/useDeviceTypes"
import useDevices from "../../../../../hooks/device/useDevices"
import DeviceCategoryDropdownComponent from "./components/category-dropdown"
import IdleDeviceItemComponent from "./components/idle-item"
import PendingDeviceItemComponent from "./components/pending-item"

export default function CheckinTabContent() {
  const { data: checkinRequests } = useDeviceCheckinRequests()
  const { data: deviceTypes } = useDeviceTypes()
  const { data: devices } = useDevices()
  const checkedInDevices = useMemo(() => {
    return deviceTypes?.items?.map((type) => ({
      type,
      devices: devices?.items?.filter(
        (item) =>
          typeof item.typeId == "object" &&
          item.typeId._id == type._id &&
          item.status == "idle"
      ),
    }))
  }, [devices, deviceTypes])
  return (
    <div className="text-xs">
      <p className="text-sm font-bold uppercase">Devices Checked in</p>
      <p>
        Listed devices that are checked in and available for use. Please be sure
        to check if the device is in working condition
      </p>
      {checkinRequests?.items && checkinRequests.items.length > 0 && (
        <div className="mt-4">
          <p className="font-bold uppercase text-gold">
            Pending Requests
            <span className="ml-2 text-disabled">
              ({checkinRequests.items.length ?? "..."})
            </span>
          </p>
          <div className="flex flex-col gap-1 px-1 py-2">
            {checkinRequests.items.map((item) => (
              <PendingDeviceItemComponent key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        {checkedInDevices
          // ?.filter((item) => item.devices && item.devices.length > 0)
          ?.map((item, idx) => (
            <DeviceCategoryDropdownComponent
              disabled={!(item.devices && item.devices?.length > 0)}
              key={idx}
              title={
                <span className="font-bold">
                  {item.type.name}{" "}
                  <span className="text-disabled">
                    ({item.devices?.length})
                  </span>
                </span>
              }
            >
              <div className="flex flex-col gap-2 py-4">
                {item.devices?.map((device) => (
                  <IdleDeviceItemComponent key={device._id} item={device} />
                ))}
              </div>
            </DeviceCategoryDropdownComponent>
          ))}
      </div>
    </div>
  )
}
