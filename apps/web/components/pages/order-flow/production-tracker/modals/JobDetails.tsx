import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { T_BackendResponse, T_Job } from "custom-validator"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useFactories from "../../../../../hooks/factories/useFactories"
import useAddJob from "../../../../../hooks/jobs/useAddJob"
import useGetPartsByFactoryLocation from "../../../../../hooks/parts/useGetPartsByFactoryLocation"
import useProfile from "../../../../../hooks/users/useProfile"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronUpDownIcon } from "@heroicons/react/20/solid"

interface NewModalProps {
  isOpen: boolean
  jobId: string | null
  onClose: () => void
}

const JobDetails = ({ isOpen, jobId, onClose }: NewModalProps) => {
  const queryClient = useQueryClient()
  const cancelButtonRef = useRef(null)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const { data: factories, isLoading: isFactoriesLoading } = useFactories()
  const [isStock, setIsStock] = useState(false)
  const {
    data: parts,
    isLoading: isPartsLoading,
    setLocationId,
    setFactoryId,
  } = useGetPartsByFactoryLocation()

  const { register, handleSubmit, reset, watch, setValue } = useForm<T_Job>()
  const { mutate, isLoading: isMutateLoading } = useAddJob()

  const onSubmit = (data: T_Job) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["jobs"],
          })
          toast.success(String(data.message))
          closeModal()
          reset()
          setIsStock(false)
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }

    mutate(
      {
        ...data,
        isStock:
          typeof data.isStock === "string"
            ? data.isStock === "true"
            : data.isStock,
        status: "Pending",
        userId: userProfile?.item._id as string,
      },
      callBackReq
    )
  }

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
                    Additional Information
                  </h3>
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
                    <tr>
                      <td
                        className={`py-4 pl-4 pr-3 text-sm font-medium sm:pl-6 lg:pl-8`}
                      >
                        9/13/2023
                      </td>
                      <td
                        className={`px-3 py-4 text-sm text-gray-700 flex flex-col`}
                      >
                        Pipe And Box
                      </td>
                      <td className={`px-3 py-4 text-sm text-gray-700`}>
                        RP1225
                      </td>
                      <td className={`px-3 py-4 text-sm text-gray-700`}>52</td>
                      <td className={`px-3 py-4 text-sm text-gray-700`}>0</td>
                    </tr>
                  </tbody>
                </table>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                    onClick={() => {
                      closeModal()
                      reset()
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
