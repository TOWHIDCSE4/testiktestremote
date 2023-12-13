import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"
import FancyButtonComponent from "./FancyButton"

const JobSelectComponent = () => {
  const {
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

  return (
    <FancyButtonComponent trigger={"off"} intent={variant}>
      <select
        disabled={isJobsLoading || isControllerJobLoading || isChangingJob}
        onChange={(e) => {
          onJobChange(jobs.find((job) => getObjectId(job) === e.target.value))
        }}
        className="bg-transparent p-0 border-none max-w-[12rem] overflow-hidden text-[#7a828d] text-normal italic"
      >
        {jobOptions.map((option) => (
          <option value={option.value} key={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </FancyButtonComponent>
  )
}

export default JobSelectComponent
