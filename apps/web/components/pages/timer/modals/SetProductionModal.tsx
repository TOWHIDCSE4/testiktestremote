import { Fragment, useRef } from "react"
import { Dialog, Transition } from "@headlessui/react"
import useUpdateLocation from "../../../../hooks/locations/useUpdateLocation"
import { T_BackendResponse, T_Location, T_Part } from "custom-validator"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"

interface SetProductionModalProps {
  isOpen: boolean
  onClose: () => void
  locationId: string
  currentLocationTabName: string
  locationProductionTime: string
}

type T_LocationProductionTime = {
  _id: string
  productionTime: number
}

const SetProductionModal = ({
  isOpen,
  locationId,
  onClose,
  currentLocationTabName,
  locationProductionTime,
}: SetProductionModalProps) => {
  const cancelButtonRef = useRef(null)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<T_LocationProductionTime>({
    values: { _id: locationId, productionTime: Number(locationProductionTime) },
  })
  const { mutate, isLoading } = useUpdateLocation()

  const onSubmit = (data: T_LocationProductionTime) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["location", locationId],
          })
          closeModal()
          reset()
          toast.success(String(data.message))
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    if (data.productionTime > 24 || data.productionTime < 1) {
      toast.error("Production time must be between 1 and 24 hours")
    } else {
      mutate(data, callBackReq)
    }
  }

  const closeModal = () => {
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className={`fixed inset-0 z-10 overflow-y-auto`}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white">
                    <h3 className="text-gray-800 font-semibold text-lg px-4 py-3">
                      {currentLocationTabName} Production Time
                    </h3>
                    <hr />
                    <div className="px-4 py-4">
                      <input
                        type="number"
                        {...register("productionTime")}
                        id="production-time"
                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6`}
                        max={24}
                        min={1}
                      />
                    </div>
                    <hr />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="ml-3 uppercase flex items-center rounded-md bg-green-700 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-900 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div
                          className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                          role="status"
                          aria-label="loading"
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      className="uppercase mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-70"
                      onClick={closeModal}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default SetProductionModal
