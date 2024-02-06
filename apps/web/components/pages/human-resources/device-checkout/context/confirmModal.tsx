import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
import { useModalContext } from "./modalContext"
import { HiQuestionMarkCircle } from "react-icons/hi"

export default function ConfirmModalComponent() {
  const { isOpen, onOkay, onCancel, description, title } = useModalContext()
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed top-0 left-0 z-50 w-screen h-screen"
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
          <div className="fixed inset-0 z-50 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 top-0 left-0 z-50 overflow-y-auto">
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
                    <div className="flex items-center justify-center gap-3 mx-auto rounded-full text-dark-blue">
                      <HiQuestionMarkCircle className="w-6 h-6" />
                      <div className="text-xl font-semibold leading-6 text-gray-900">
                        {title}
                      </div>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Description
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {description}
                      </Dialog.Description>
                    </div>
                  </div>
                  <div className="flex mt-5 space-x-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={onCancel}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                      onClick={onOkay}
                    >
                      Yes
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
