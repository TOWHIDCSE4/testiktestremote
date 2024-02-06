import Controller from "../../../../../../components/pages/production/timer/Controller"

const FullScreenController = ({ params }: { params: { timerId: string } }) => {
  return <Controller timerId={params.timerId} />
}

export default FullScreenController
