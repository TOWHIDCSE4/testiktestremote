import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import useDeleteUser from "../../../../hooks/users/useDeleteUser"
import { useQueryClient } from "@tanstack/react-query"
import { T_BackendResponse, T_User } from "custom-validator"
import toast from "react-hot-toast"
import { T_UserStatus } from "custom-validator"
import useUpdateUser from "../../../../hooks/users/useUpdateUser"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  user: T_User
  status: T_UserStatus
}

const DeleteModal = ({ isOpen, onClose, user, status }: DeleteModalProps) => {
  const queryClient = useQueryClient()
  const [isDeleted, setIsDeleted] = useState(false)
  const { mutate, isLoading: isUpdateUserLoading } = useUpdateUser()

  const close = () => {
    onClose()
    setIsDeleted(false)
  }

  const callBackReq = {
    onSuccess: (returnData: T_BackendResponse) => {
      if (!returnData.error) {
        if (returnData.item) {
          queryClient.invalidateQueries({
            queryKey: ["paginated-users"],
          })
          onClose()
          toast.success(`User ${status}`)
        }
      } else {
        toast.error(returnData.message as string)
      }
    },
    onError: (err: any) => {
      toast.error(String(err))
    },
  }

  const formatStatus = (status: T_UserStatus) => {
    switch (status) {
      case "Rejected":
        return "reject"
      case "Blocked":
        return "block"
      case "Archived":
        return "delete"
    }
  }

  const renderConfirmation = () => {
    return (
      <>
        <div>
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <ExclamationTriangleIcon
              className="h-12 w-12 text-red-700"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Are you sure you want to {formatStatus(status)} {user.firstName}{" "}
              {user.lastName}?
            </Dialog.Title>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 flex space-x-5">
          <button
            type="button"
            className="inline-flex w-full justify-center border border-gray-300 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={close}
            disabled={isUpdateUserLoading}
          >
            No
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-950 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isUpdateUserLoading}
            onClick={() => {
              setIsDeleted(true)
              mutate({ ...user, status }, callBackReq)
            }}
          >
            Yes
          </button>
        </div>
      </>
    )
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
                {renderConfirmation}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default DeleteModal
