import SingleTimeTracker from "../../../../../../../components/pages/production/timer/SingleTimeTracker"

const FullScreen = ({
  params,
}: {
  params: { locationId: string; machineClassId: string }
}) => {
  return (
    <>
      <SingleTimeTracker
        locationId={params.locationId}
        machineClassId={params.machineClassId}
      />
    </>
  )
}

export default FullScreen
