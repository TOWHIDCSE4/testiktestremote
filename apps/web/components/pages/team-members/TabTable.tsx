import React, { Fragment, useEffect, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { T_BackendResponse, T_User, T_UserRole } from "custom-validator"
import DeleteModal from "./modals/DeleteModal"
import ConfirmationModal from "./modals/ConfirmationModal"

const TabTable = ({
  tab,
  data,
  userId,
  isUsersLoading,
}: {
  tab: T_UserRole
  data: T_BackendResponse
  userId: string
  isUsersLoading: boolean
}) => {
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedRowId, setSelectedRowId] = useState("")
  return (
    <>
      {isUsersLoading ? (
        <div className="flex items-center justify-center my-4">
          <div
            className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-dark-blue rounded-full my-1 mx-2"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-5 md:pl-7 lg:pl-9 text-left text-sm font-semibold text-gray-900 w-60 uppercase"
              >
                First Name
              </th>
              <th
                scope="col"
                className="py-3.5 text-left text-sm font-semibold text-gray-900 w-60 uppercase pl-4"
              >
                <a href="#" className="group inline-flex">
                  Last Name
                </a>
              </th>
              <th
                scope="col"
                className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-60 uppercase"
              >
                <a href="#" className="group inline-flex">
                  Status
                </a>
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8"
              >
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.items?.map((user: T_User, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 pl-4 text-sm sm:pl-6 lg:pl-9 text-gray-800">
                  {user.firstName}
                </td>
                <td className="py-4 text-sm text-gray-800 pl-4">
                  {user.lastName}
                </td>
                <td
                  className={`py-4 pl-6 text-sm ${
                    user.approvedBy ? "text-green-500" : "text-yellow-600"
                  }`}
                >
                  {user.approvedBy ? "Approved" : "Pending"}
                </td>
                {user._id === userId ? (
                  <></>
                ) : (
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8 z-10">
                    <Menu as="div">
                      <Menu.Button>
                        <EllipsisVerticalIcon className="h-6 w-6 text-gray-700 cursor-pointer" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items>
                          <div className="rounded-md border border-gray-300 absolute py-1 right-0 -translate-x-[10px] bg-white">
                            {!user.approvedBy ? (
                              <Menu.Item>
                                {({ active }) => (
                                  <div
                                    className="text-left text-gray-800 cursor-pointer hover:bg-gray-100 px-6 py-1"
                                    onClick={() => {
                                      setConfirmationModal(true)
                                      setSelectedRowId(user._id as string)
                                    }}
                                  >
                                    Accept
                                  </div>
                                )}
                              </Menu.Item>
                            ) : (
                              <></>
                            )}
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  className="text-left text-gray-800 cursor-pointer hover:bg-gray-100 px-6 py-1"
                                  onClick={() => {
                                    setDeleteModal(true)
                                    setSelectedRowId(user._id as string)
                                  }}
                                >
                                  Delete
                                </div>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ConfirmationModal
        isOpen={confirmationModal}
        onClose={() => setConfirmationModal(false)}
        id={selectedRowId}
        userId={userId}
      />
      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        id={selectedRowId}
      />
    </>
  )
}

export default TabTable
