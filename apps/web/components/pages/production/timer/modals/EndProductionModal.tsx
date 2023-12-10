import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import toast from "react-hot-toast"
import { T_BackendResponse } from "custom-validator"
import useUpdateControllerTimer from "../../../../../hooks/timers/useUpdateControllerTimer"
import useEndControllerTimer from "../../../../../hooks/timers/useEndControllerTimer"

interface EndProductionModalProps {
  isOpen: boolean
  onClose: () => void
  stopTimer: () => void
  timerId: string
  controllerTimerId: string
  isTimerClockRunning: boolean
}

const EndProductionModal = ({
  isOpen,
  onClose,
  stopTimer,
  timerId,
  controllerTimerId,
  isTimerClockRunning,
}: EndProductionModalProps) => {
  const [isEnding, setIsEnding] = useState(false)
  const { mutate: endControllerTimer, isLoading: isEndControllerTimerLoading } =
    useEndControllerTimer()

  const callBackReq = {
    onSuccess: (returnData: T_BackendResponse) => {
      if (!returnData.error) {
      } else {
        toast.error(returnData.message as string)
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  const close = () => {
    if (controllerTimerId && isTimerClockRunning) {
      setIsEnding(true)
      stopTimer()
      setTimeout(function () {
        endControllerTimer(timerId, callBackReq)
        onClose()
        toast.success("Timer was ended")
        setIsEnding(false)
      }, 3000)
    } else {
      toast.error("You already ended this timer")
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-60" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-50 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-sm sm:p-6">
                <>
                  <div>
                    <div className="flex items-center justify-center w-24 h-24 mx-auto bg-yellow-100 rounded-full">
                      <ExclamationTriangleIcon
                        className="w-12 h-12 text-yellow-700"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Are you sure you want to end the production of this
                        timer?
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="flex mt-5 space-x-5 sm:mt-6">
                    <button
                      type="button"
                      disabled={isEnding}
                      className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={onClose}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      disabled={isEnding}
                      className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                      onClick={close}
                    >
                      {isEnding ? (
                        <div
                          className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full"
                          role="status"
                          aria-label="loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Yes"
                      )}
                    </button>
                  </div>
                </>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default EndProductionModal
