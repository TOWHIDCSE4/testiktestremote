import { Fragment, useContext, useMemo, useRef, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"
import FancyButtonComponent from "./FancyButton"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import NewJobModal from "../../../order-flow/production-tracker/modals/NewModal"
import { Combobox, Transition } from "@headlessui/react"
import { HiChevronDoubleDown } from "react-icons/hi"
import useColor from "./useColor"

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
  const color = useColor({ variant })
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

  const jobId = useMemo(() => {
    return getObjectId(controllerJob)
  }, [controllerJob])

  const jobValue = useMemo(() => {
    const job = jobOptions.find((item) => {
      return item.value == jobId
    })
    return job
  }, [jobId, jobOptions])

  const onChange = (selected: any) => {
    const job = jobs.find((job) => getObjectId(job) === selected.value)
    if (selected === "select_job") {
      return
    }
    if (selected === "add_job") {
      if (dropdownRef.current) {
        dropdownRef.current.value = "select_job"
      }
      setOpenNewJobModal(true)
    } else {
      onJobChange(job)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Combobox
      value={jobValue}
      disabled={isJobsLoading || isControllerJobLoading || isChangingJob}
      ref={dropdownRef as any}
      onChange={onChange}
    >
      <div>
        <FancyButtonComponent intent={variant} trigger={"off"}>
          <div className="relative flex items-center">
            <Combobox.Input
              className={`flex-1 p-0 pr-6 border-none font-semibold text-sm leading-5 text-[#5D5D5D] focus:ring-0 bg-[#E8EBF0] italic`}
              ref={inputRef}
              displayValue={(job: any) => job?.label}
            />
            <div className="absolute right-0 flex items-center pr-1">
              <Combobox.Button
                onClick={() => inputRef.current?.focus()}
                className="inset-y-0 z-20 flex items-center"
              >
                <HiChevronDoubleDown className={`text-${color}`} />
              </Combobox.Button>
            </div>
          </div>
        </FancyButtonComponent>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {}}
        >
          <Combobox.Options className="absolute z-50 w-64 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-40 ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {jobOptions.map((option) => (
              <Combobox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 px-2 ${
                    active ? "bg-[#E8EBF0] text-black" : "text-black-900"
                  }`
                }
              >
                {({ selected, active }) => (
                  <div className={selected ? `bg-primary` : ``}>
                    {option.label}
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )

  return (
    <>
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
    </>
  )
}

export default JobSelectComponent
