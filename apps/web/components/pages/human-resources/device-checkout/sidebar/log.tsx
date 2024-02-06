import useDeviceLogs from "../../../../../hooks/device/useDeviceLogs"
import DeviceLogsTableComponent from "./components/log-table"

export default function LogsTabContent() {
  const { data: deviceLogs } = useDeviceLogs()

  return (
    <div className="text-xs">
      <p className="text-sm font-bold uppercase">Devices Global Log</p>
      <p className="my-2">
        This log section keeps track of when the device is checked in and
        checked out including when the device is approved for checkout and
        approved for checkin. this can solve the issue later on when devices
        were handled.
      </p>
      <DeviceLogsTableComponent
        pageSize={30}
        logs={deviceLogs?.items}
        height="400px"
      />
    </div>
  )
}
