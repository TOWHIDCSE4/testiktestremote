import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import useRemoveTimer from "../../../../../hooks/timers/useRemoveTimer"
import { T_BackendResponse } from "custom-validator"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  id?: string
}

const DeleteModal = ({ isOpen, onClose, id }: DeleteModalProps) => {
  const queryClient = useQueryClient()
  const { mutate: removeTimer, isLoading } = useRemoveTimer()
  const callBackReq = {
    onSuccess: (data: T_BackendResponse) => {
      if (!data.error) {
        queryClient.invalidateQueries({
          queryKey: ["timers-location"],
        })
        toast.success("Timer has been deleted")
        onClose()
      } else {
        toast.error(String(data.message))
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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

        <div className="fixed inset-0 z-50 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6">
                <>
                  <div>
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
                      <ExclamationTriangleIcon
                        className="h-12 w-12 text-yellow-700"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Are you sure you want to remove this timer?
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex space-x-5">
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inline-flex w-full justify-center border border-gray-300 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={onClose}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      className="inlne-flex w-full justify-center rounded-md bg-blue-950 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                      onClick={() => {
                        removeTimer(id as string, callBackReq)
                      }}
                    >
                      {isLoading ? (
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

export default DeleteModal
