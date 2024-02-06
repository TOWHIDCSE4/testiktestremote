import SingleTimerTracker from "../../../../../../components/pages/production/timer/TimerTracker/SingleTimerTracker"

const FullScreen = ({ params }: { params: { timerId: string } }) => {
  return (
    <>
      <SingleTimerTracker timerId={params.timerId} />
    </>
  )
}

export default FullScreen
