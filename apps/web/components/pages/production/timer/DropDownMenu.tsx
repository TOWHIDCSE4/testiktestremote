import { Fragment, MouseEventHandler } from "react"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import combineClasses from "../../../../helpers/combineClasses"

export default function DropDownMenu({
  setOpenEditModal,
  setOpenDeleteModal,
}: {
  setOpenEditModal: Function
  setOpenDeleteModal: Function
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="flex items-center text-gray-700 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 focus:ring-offset-blue-100"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-8 w-8" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => setOpenEditModal(e)}
                  className={combineClasses(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                >
                  Details
                </span>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <span
                  onClick={(e) => setOpenDeleteModal(e)}
                  className={combineClasses(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                >
                  Delete
                </span>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
