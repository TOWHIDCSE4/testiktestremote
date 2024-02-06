import { Fragment, useContext, useMemo, useRef, useState } from "react"
import { ControllerContext } from "./ControllerContext"
import { getObjectId } from "../../../../../helpers/ids"
import FancyButtonComponent from "./FancyButton"
import useGetTimerDetails from "../../../../../hooks/timers/useGetTimerDetails"
import NewJobModal from "../../../order-flow/production-tracker/modals/NewModal"
import { Combobox, Transition } from "@headlessui/react"
import { HiChevronDoubleDown } from "react-icons/hi"
import { textCV } from "./classVariants"

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

  const jobId = controllerJob?.jobId
  const jobValue = jobOptions.find((item) => {
    return item.value == jobId
  })

  const onChange = (selected: any) => {
    if (selected === "add_job") {
      if (dropdownRef.current) {
        dropdownRef.current.value = "select_job"
      }
      setOpenNewJobModal(true)
    } else {
      const job = jobs.find((job) => getObjectId(job) === selected.value)
      onJobChange(job)
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const textColors = textCV

  return (
    <>
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
                className={`flex-1 bg-transparent p-0 pr-6 border-none font-semibold text-sm leading-5 text-[#5D5D5D] dark:text-white focus:ring-0 italic`}
                ref={inputRef}
                placeholder="Select Job"
                displayValue={(job: any) => job?.label}
              />
              <div className="absolute right-0 flex items-center pr-1">
                <Combobox.Button
                  onClick={() => inputRef.current?.focus()}
                  className="inset-y-0 flex items-center"
                >
                  <HiChevronDoubleDown className={textColors[variant]} />
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
            <Combobox.Options className="absolute z-50 w-64 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg dark:text-white dark:bg-dark-cyan-blue max-h-40 ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {jobOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-2 dark:text-white dark:bg-dark-cyan-blue ${
                      active ? "bg-[#E8EBF0] text-black" : "text-black-900"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                    </>
                  )}
                </Combobox.Option>
              ))}
              <Combobox.Option
                value="add_job"
                className={({ active }) =>
                  `relative opacity-60 bg-transparent cursor-default select-none py-2 px-2 ${
                    active
                      ? "bg-[#E8EBF0] text-black dark:text-white dark:opacity-100"
                      : "text-black-900 dark:text-white"
                  }`
                }
              >
                {({ selected, active }) => (
                  <div className={selected ? `bg-primary` : ``}>
                    Add new job
                  </div>
                )}
              </Combobox.Option>
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
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
