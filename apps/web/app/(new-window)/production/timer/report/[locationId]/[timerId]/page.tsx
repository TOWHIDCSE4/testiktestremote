import Report from "../../../../../../../components/pages/production/timer/Report"

const PageReport = ({
  params,
}: {
  params: { locationId: string; timerId: string }
}) => {
  return <Report locationId={params.locationId} timerId={params.timerId} />
}

export default PageReport
