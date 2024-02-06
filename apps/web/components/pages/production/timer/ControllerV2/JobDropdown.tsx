import { useContext, useEffect, useRef } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"

const JobDropdwown = () => {
  const {
    jobs,
    isJobsLoading,
    isControllerJobLoading,
    onJobChange,
    controllerJob,
    isChangingJob,
    isCycleClockRunning,
  } = useContext(ControllerContext)
  const jobOptions = jobs.map((job) => ({
    label: job.name,
    value: getObjectId(job),
  }))
  const selectRef = useRef<HTMLSelectElement>()

  useEffect(() => {
    if (controllerJob && selectRef.current && jobs.length) {
      selectRef.current.value = getObjectId(controllerJob.jobId)
    }
  }, [selectRef, jobs, getObjectId(controllerJob)])

  return (
    <div>
      <select
        disabled={isJobsLoading || isControllerJobLoading || isChangingJob}
        ref={selectRef as any}
        onChange={(e) => {
          onJobChange(jobs.find((job) => getObjectId(job) === e.target.value))
        }}
      >
        <option>Select Job</option>
        {jobOptions.map((option) => (
          <option
            value={option.value}
            selected={getObjectId(controllerJob) === option.value}
            key={option.label}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default JobDropdwown
