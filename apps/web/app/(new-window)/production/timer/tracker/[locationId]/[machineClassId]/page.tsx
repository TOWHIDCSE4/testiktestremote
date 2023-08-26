import TimerTracker from "../../../../../../../components/pages/production/timer/TimerTracker"

const FullScreen = ({
  params,
}: {
  params: { locationId: string; machineClassId: string }
}) => {
  return (
    <>
      <TimerTracker
        locationId={params.locationId}
        machineClassId={params.machineClassId}
      />
    </>
  )
}

export default FullScreen
