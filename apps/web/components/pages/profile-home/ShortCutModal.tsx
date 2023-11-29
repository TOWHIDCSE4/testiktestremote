import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect, useState } from "react"
import { useBookmarks } from "../../../hooks/bookmarks/useBookmarks"

interface Timer {
  _id: string
  operatorName: string
}

interface Machine {
  _id: string
  name: string
}

interface TimerItem {
  _id: string
  name: string
  timers: Timer
  machines: Machine[]
}

export default function ShortCutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { getBookmarks, deleteBookmark } = useBookmarks()
  const [machineClasses, setMachineClasses] = useState([] as TimerItem[][])

  const fetchData = async () => {
    const response = await getBookmarks()
    setMachineClasses(response.items)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onDelete = async (machineClassId: string) => {
    const deleted = await deleteBookmark(machineClassId)
    if (deleted) {
      const remainingItems = machineClasses.filter(
        (machineClass) => machineClass[0]._id != machineClassId
      )
      setMachineClasses(remainingItems)
    }
  }
  const openController = (timerId: string) => {
    window.open(
      `/production/timer/controller/${timerId}`,
      "Timer Controller",
      "location,status,scrollbars,resizable,width=1024, height=800"
    )
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm max-h-[400px] transform overflow-y-scroll overflow-x-hidden rounded-2xl bg-orange-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl leading-6 text-gray-900 font-bold"
                  >
                    TIMER SHORTCUT
                  </Dialog.Title>
                  <div className="mt-5 space-y-3">
                    {machineClasses.map((machineClass, index) => (
                      <div key={index} className="space-y-2">
                        <div className="p-2 bg-gray-300 rounded-md flex justify-between">
                          <h4 className="uppercase">{machineClass[0]?.name}</h4>
                          <i
                            title="Unpin Section"
                            className="cursor-pointer"
                            onClick={() => onDelete(machineClass[0]?._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </i>
                        </div>

                        {machineClass[0].machines.length > 0 &&
                          machineClass.map((item) => (
                            <div
                              key={item.timers._id}
                              className="border-b-[1px] border-gray-400 pb-2"
                            >
                              <div className="flex justify-between pb-1">
                                <h4 className="text-lg font-bold tracking-wider">
                                  {item?.machines[0]?.name}
                                </h4>
                                <button
                                  onClick={() =>
                                    openController(item?.timers._id)
                                  }
                                  type="button"
                                  className="bg-green-800 text-white text-sm px-3 py-1 rounded-lg uppercase tracking-wider"
                                >
                                  controller
                                </button>
                              </div>
                              <div className="px-3 text-xs text-gray-400">
                                <div>STATUS: NOT RUNNING</div>
                                <div>
                                  CURRENT OPERATOR:{" "}
                                  <span className="uppercase">
                                    {item?.timers.operatorName}
                                  </span>
                                </div>
                                <div>LAST UPDATED: </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
