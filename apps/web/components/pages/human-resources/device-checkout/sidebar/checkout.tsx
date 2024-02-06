import PendingDeviceItemComponent from "./components/pending-item"
import DeviceCategoryDropdownComponent from "./components/category-dropdown"
import ActiveDeviceItemComponent from "./components/active-item"
import useDeviceCheckoutRequests from "../../../../../hooks/device/useDeviceCheckoutRequests"
import useDevices from "../../../../../hooks/device/useDevices"
import { useMemo } from "react"
import useDeviceTypes from "../../../../../hooks/device/useDeviceTypes"

export default function CheckoutTabContent() {
  const { data: checkoutRequests } = useDeviceCheckoutRequests()
  const { data: devices } = useDevices()
  const { data: deviceTypes } = useDeviceTypes()
  const checkedOutDevices = useMemo(() => {
    return deviceTypes?.items?.map((type) => ({
      type,
      devices: devices?.items?.filter(
        (item) =>
          typeof item.typeId == "object" &&
          item.typeId._id == type._id &&
          item.status == "using"
      ),
    }))
  }, [devices, deviceTypes])
  return (
    <div className="text-xs">
      <p className="text-sm font-bold uppercase">Devices Checked out</p>
      <p>
        Listed devices that are checked out, message the user to request access
        to the checked out device.
      </p>
      {checkoutRequests?.items && checkoutRequests.items.length > 0 && (
        <div className="mt-4">
          <p className="font-bold uppercase text-gold">
            Pending Requests
            <span className="ml-2 text-disabled">
              ({checkoutRequests.items.length ?? "..."})
            </span>
          </p>
          <div className="flex flex-col gap-1 px-1 py-2">
            {checkoutRequests.items.map((item) => (
              <PendingDeviceItemComponent key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-4">
        {checkedOutDevices
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
                  <ActiveDeviceItemComponent item={device} key={device._id} />
                ))}
              </div>
            </DeviceCategoryDropdownComponent>
          ))}
      </div>
    </div>
  )
}
