import { useContext, useRef, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"
import FancyButtonComponent from "./FancyButton"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import NewJobModal from "../../../order-flow/production-tracker/modals/NewModal"

const JobSelectComponent = () => {
  const {
    timerId,
    controllerJob,
    jobs,
    isJobsLoading,
    isControllerJobLoading,
    onJobChange,
    isChangingJob,
    variant,
  } = useContext(ControllerContext)
  const jobOptions = jobs.map((job) => ({
    label: job.name,
    value: getObjectId(job),
  }))
  const [openNewJobModal, setOpenNewJobModal] = useState(false)

  const { data: timerDetails, isLoading: isTimerDetailDataLoading } =
    useGetTimerDetails(timerId)
  const dropdownRef = useRef<HTMLSelectElement>()
  const partId =
    typeof timerDetails?.partId === "object" && timerDetails?.partId._id
      ? timerDetails?.partId._id
      : ""
  const locationId =
    typeof timerDetails?.item?.locationId === "object" &&
    timerDetails?.item?.locationId._id
      ? timerDetails?.item?.locationId._id
      : ""

  return (
    <FancyButtonComponent trigger={"off"} intent={variant}>
      <select
        disabled={isJobsLoading || isControllerJobLoading || isChangingJob}
        ref={dropdownRef as any}
        onChange={(e) => {
          if (e.target.value === "select_job") {
            return
          }
          if (e.target.value === "add_job") {
            if (dropdownRef.current) {
              dropdownRef.current.value = "select_job"
            }
            setOpenNewJobModal(true)
          } else {
            onJobChange(jobs.find((job) => getObjectId(job) === e.target.value))
          }
        }}
        className="bg-transparent p-0 border-none max-w-[12rem] overflow-hidden text-[#7a828d] text-normal italic"
      >
        <option value="select_job">Select Job</option>
        {jobOptions.map((option) => (
          <option
            value={option.value}
            key={option.label}
            selected={getObjectId(controllerJob) === option.value}
          >
            {option.label}
          </option>
        ))}
        <option value="add_job">Add New Job</option>
      </select>
      <NewJobModal
        isOpen={openNewJobModal}
        jobTimer={controllerJob}
        locationState={
          typeof timerDetails?.item?.locationId === "object" &&
          timerDetails?.item?.locationId._id
            ? timerDetails?.item?.locationId.name
            : "Loading..."
        }
        locationId={locationId}
        onClose={() => {
          if (dropdownRef.current) {
            dropdownRef.current.value = "select_job"
          }
          setOpenNewJobModal(false)
        }}
        partId={partId}
        timerDetails={timerDetails?.item}
        timer={true}
      />
    </FancyButtonComponent>
  )
}

export default JobSelectComponent
