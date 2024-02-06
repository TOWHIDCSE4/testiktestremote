import { Fragment, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"
import useGetLogsByDate from "../../../../../hooks/timerLogs/useGetLogsByDate"

interface NewModalProps {
  isOpen: boolean
  jobId: string | null
  jobName: string | null
  onClose: () => void
}

type T_GroupLogs = {
  _id: string
  machine: string
  factory: string
  drawingNumber: string
  count: number
}

const JobDetails = ({ isOpen, jobId, jobName, onClose }: NewModalProps) => {
  const cancelButtonRef = useRef(null)
  const { data, isLoading } = useGetLogsByDate(jobId as string)

  const closeModal = () => {
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" />
        </Transition.Child>

        <div className={`fixed inset-0 overflow-y-auto z-50`}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-4xl">
                <div className="px-6 py-4">
                  <h3 className="text-2xl font-semibold">
                    Job Additional Information
                  </h3>
                  <p className="mt-2">
                    Job Name: <span className="font-bold">{jobName}</span>
                  </p>
                </div>
                <table className="w-full divide-y divide-gray-300 border-t border-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className={`text-sm py-3.5 pr-3 text-left font-semibold text-gray-900 pl-4 lg:pl-8 uppercase`}
                      >
                        <a href="#" className="group inline-flex items-center">
                          Date
                          <span className="ml-2 flex-none rounded text-gray-400">
                            <ChevronUpDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                      >
                        <a href="#" className="group inline-flex items-center">
                          Factory
                          <span className="ml-2 flex-none rounded text-gray-400">
                            <ChevronUpDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                      >
                        <a href="#" className="group inline-flex items-center">
                          Machine
                          <span className="ml-2 flex-none rounded text-gray-400">
                            <ChevronUpDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                      >
                        <a href="#" className="group inline-flex items-center">
                          Drawing
                          <span className="ml-2 flex-none rounded text-gray-400">
                            <ChevronUpDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>
                      <th
                        scope="col"
                        className={`text-sm px-3 py-3.5 text-left font-semibold text-gray-900 uppercase`}
                      >
                        <a href="#" className="group inline-flex items-center">
                          Count
                          <span className="ml-2 flex-none rounded text-gray-400">
                            <ChevronUpDownIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.items?.map((item: T_GroupLogs, index: number) => (
                      <tr key={index}>
                        <td
                          className={`py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 lg:pl-8`}
                        >
                          {item._id}
                        </td>
                        <td
                          className={`px-3 py-4 text-sm text-gray-700 flex flex-col`}
                        >
                          {item.factory}
                        </td>
                        <td className={`px-3 py-4 text-sm text-gray-700`}>
                          {item.machine}
                        </td>
                        <td className={`px-3 py-4 text-sm text-gray-700`}>
                          {item.drawingNumber}
                        </td>
                        <td className={`px-3 py-4 text-sm text-gray-700`}>
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isLoading && (
                  <div className="flex items-center justify-center w-full my-6">
                    <div
                      className="animate-spin inline-block w-6 h-6 border-4 border-current border-t-transparent text-dark-blue rounded-full"
                      role="status"
                      aria-label="loading"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                {!isLoading && data?.itemCount === 0 && (
                  <div className="flex items-center justify-center w-full my-6">
                    <h3 className="text-gray-500">No logs found</h3>
                  </div>
                )}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                    onClick={() => {
                      closeModal()
                    }}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default JobDetails
