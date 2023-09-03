import SingleTimeTracker from "../../../../../../components/pages/production/timer/SingleTimeTracker"

const FullScreen = ({ params }: { params: { timerId: string } }) => {
  return (
    <>
      <SingleTimeTracker timerId={params.timerId} />
    </>
  )
}

export default FullScreen
