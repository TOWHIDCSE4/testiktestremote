import { useMemo } from "react"
import useDevices from "../../../../hooks/device/useDevices"
import DeviceCheckoutItemComponent from "./DeviceCheckoutItem"
import useProfile from "../../../../hooks/users/useProfile"

export default function DeviceCheckoutListComponent() {
  const { data: userProfile } = useProfile()
  const { data: devices } = useDevices()
  const checkedOutDevices = useMemo(() => {
    if (!userProfile?.item) return undefined
    return devices?.items?.filter(
      (item) =>
        item.history &&
        typeof item.history == "object" &&
        typeof item.history.userId == "object" &&
        item.status == "using" &&
        userProfile.item._id == item.history.userId._id
    )
  }, [devices, userProfile?.item])

  if (checkedOutDevices && checkedOutDevices.length > 0)
    return (
      <div className="pt-4">
        <div className="text-sm font-semibold uppercase">
          Devices Checked Out -{" "}
          <span className="text-gold">{checkedOutDevices?.length}</span>
        </div>
        <div className="py-2 pl-4 text-xs">
          Listed devices you have checked out. Monitor your use term and get an
          admin or
          <br />
          HR Director to check your device back in.
        </div>
        <div className="flex flex-col gap-4 md:pl-6">
          {checkedOutDevices?.map((item) => (
            <DeviceCheckoutItemComponent key={item._id} item={item} />
          ))}
        </div>
      </div>
    )
  else return <></>
}
