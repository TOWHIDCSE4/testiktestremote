import { useContext } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"

const JobDropdwown = () => {
  const {
    jobs,
    isJobsLoading,
    isControllerJobLoading,
    onJobChange,
    isChangingJob,
    isCycleClockRunning,
  } = useContext(ControllerContext)
  const jobOptions = jobs.map((job) => ({
    label: job.name,
    value: getObjectId(job),
  }))

  return (
    <div>
      <select
        disabled={
          isJobsLoading ||
          isControllerJobLoading ||
          isCycleClockRunning ||
          isChangingJob
        }
        onChange={(e) => {
          onJobChange(jobs.find((job) => getObjectId(job) === e.target.value))
        }}
      >
        {jobOptions.map((option) => (
          <option value={option.value} key={option.label}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default JobDropdwown
