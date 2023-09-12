import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import Image from "next/image"
import DeleteModal from "./modals/DeleteModal"
import EditModal from "./modals/EditModal"
import combineClasses from "../../../../helpers/combineClasses"
import TabTable from "./TabTable"
import { T_JobStatus } from "custom-validator"
import useCountStatus from "../../../../hooks/jobs/useCountStatus"
import usePartLocationCount from "../../../../hooks/parts/useGetPartLocationCount"

const ParentTable = ({ locationId }: { locationId: string }) => {
  const [currentTab, setCurrentTab] = useState<T_JobStatus>("Pending")
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const { data, isLoading, setJobStatuses, setJobLocation } = useCountStatus()

  const tabs = [
    { name: "Pending", count: 0, current: currentTab === "Pending" },
    { name: "Active", count: 2, current: currentTab === "Active" },
    { name: "Testing", count: 1, current: currentTab === "Testing" },
    { name: "Archived", count: 0, current: currentTab === "Archived" },
    { name: "Deleted", count: 0, current: currentTab === "Deleted" },
  ]

  useEffect(() => {
    if (locationId) {
      setJobLocation(locationId)
    }
    setJobStatuses(tabs.map((tab) => tab.name) as string[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId])

  const jobStatusCount = data
    ? data?.map((jobCount) => {
        if (!jobCount.error) {
          return jobCount.item
        }
      })
    : []

  return (
    <>
      <div
        className={`drop-shadow-lg border border-gray-200 bg-white rounded-md mt-7`}
      >
        <div>
          <div>
            {/* Tabs */}
            <div
              className={`flex items-center px-4 md:px-0 mt-4 pb-4 md:pb-0 md:mt-0 shadow`}
            >
              <div className="w-full">
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-blue-950"
                    defaultValue={
                      // @ts-expect-error
                      tabs.find((tab) => tab.current).name
                    }
                    onChange={(e) => {
                      setCurrentTab(e.currentTarget.value as T_JobStatus)
                    }}
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name} value={tab.name}>
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:block">
                  <nav
                    className="isolate flex divide-x divide-gray-200"
                    aria-label="Tabs"
                  >
                    {tabs.map((tab, tabIdx) => (
                      <button
                        key={tab.name}
                        className={combineClasses(
                          tab.current
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-700",
                          tabIdx === 0 ? "" : "",
                          tabIdx === tabs.length - 1 ? "" : "",
                          "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10"
                        )}
                        aria-current={tab.current ? "page" : undefined}
                        onClick={() => setCurrentTab(tab.name as T_JobStatus)}
                      >
                        <span>
                          {isLoading
                            ? "Loading..."
                            : `${tab.name} (${jobStatusCount[tabIdx]})`}
                        </span>
                        <span
                          aria-hidden="true"
                          className={combineClasses(
                            tab.current ? "bg-blue-950" : "bg-transparent",
                            "inset-x-0 bottom-0 h-1"
                          )}
                        />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="w-full overflow-x-auto relative">
              {/* <table className="w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-5 md:pl-7 lg:pl-9 text-left text-sm font-semibold text-gray-900 w-16 uppercase"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 text-left text-sm font-semibold text-gray-900 uppercase pl-4"
                    >
                      <a href="#" className="group inline-flex">
                        Factory
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Name
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Part
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Machine
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Draw
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Count
                      </a>
                    </th>
                    <th
                      scope="col"
                      className={`${
                        currentTab === "Active" ? "hidden" : ""
                      } pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase`}
                    >
                      <a href="#" className="group inline-flex">
                        Status
                      </a>
                    </th>
                    <th
                      scope="col"
                      className="pl-6 py-3.5 text-left text-sm font-semibold text-gray-900 w-32 uppercase"
                    >
                      <a href="#" className="group inline-flex">
                        Due
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
                  {currentTab === "Active" ? (
                    <>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 pl-4 text-sm sm:pl-6 lg:pl-8">
                          <div className="h-11 w-11 bg-stone-500 rounded-full text-white flex items-center justify-center">
                            UA
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-500 pl-5">
                          <div className="h-11 w-11 bg-blue-500 rounded-full uppercase text-white flex items-center justify-center">
                            Pipe
                          </div>
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          Langdon Units 6-10
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          4x2x8.00 C1577 BOX CULVERT &lt; 2 <br />
                          <span className="text-gray-500">30 Ton</span>
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800"></td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          4 &apos;X2&apos;X8&apos; - W/ Ø24&qout; OPENING TOP /
                          3&apos;X2&apos; REDUCER 0-2 4X2-3
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          1 / 2
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          08-30-2023 <br />
                          <span className="text-red-500 hidden">Overdue</span>
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
                                <div className="rounded-md border border-gray-300 absolute py-3 px-6 -translate-x-[78px] z-10 bg-white">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <div
                                        className="text-left text-gray-800 cursor-pointer"
                                        onClick={() => setEditModal(true)}
                                      >
                                        Edit
                                      </div>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <div
                                        className="text-left text-gray-800 mt-2 cursor-pointer"
                                        onClick={() => setDeleteModal(true)}
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
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-4 pl-4 text-sm sm:pl-6 lg:pl-8">
                          <div className="h-11 w-11 bg-stone-500 rounded-full text-white flex items-center justify-center">
                            UA
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-500 pl-5">
                          <div className="h-11 w-11 bg-blue-500 rounded-full uppercase text-white flex items-center justify-center">
                            Pipe
                          </div>
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          Dc Stock
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          4&apos;X4&apos;X8&apos; 0&apos;&lt;2&apos; FILL RCB
                          <br />
                          <span className="text-gray-500">50 Ton</span>
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800"></td>
                        <td className="py-4 pl-6 text-sm text-gray-800">RCB</td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          <div className="flex items-center">
                            1 / <span className="text-xl font-medium">∞</span>
                          </div>
                        </td>
                        <td className="py-4 pl-6 text-sm text-gray-800">
                          08-25-2023 <br />
                          <span className="text-red-500 hidden">Overdue</span>
                        </td>
                        <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
                                <div className="rounded-md border border-gray-300 absolute py-3 px-6 -translate-x-[78px] bg-white">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <div
                                        className="text-left text-gray-800 cursor-pointer"
                                        onClick={() => setEditModal(true)}
                                      >
                                        Edit
                                      </div>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <div
                                        className="text-left text-gray-800 mt-2 cursor-pointer"
                                        onClick={() => setDeleteModal(true)}
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
                      </tr>
                    </>
                  ) : currentTab === "Testing" ? (
                    <tr className="border-b border-gray-200">
                      <td className="py-4 pl-4 text-sm sm:pl-6 lg:pl-8">
                        <div className="h-11 w-11 relative bg-stone-500 rounded-full text-white flex items-center justify-center">
                          <Image
                            className="rounded-full"
                            src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?5315ffb"
                            fill
                            alt="Row image"
                          />
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-500 pl-5">
                        <div className="h-11 w-11 bg-blue-500 rounded-full uppercase text-white flex items-center justify-center">
                          Pipe
                        </div>
                      </td>
                      <td className="py-4 pl-6 text-sm text-gray-800">
                        Testing
                      </td>
                      <td className="py-4 pl-6 text-sm text-gray-800">
                        RP1225
                      </td>
                      <td className="py-4 pl-6 text-sm text-gray-800"></td>
                      <td className="py-4 pl-6 text-sm text-gray-800">23</td>
                      <td className="py-4 pl-6 text-sm text-gray-800">
                        <div className="flex items-center">0 / 5</div>
                      </td>
                      <td className="py-4 pl-6 text-sm text-gray-800">
                        Finished
                        <div className="h-2 w-6 bg-cyan-500 rounded-full mt-1"></div>
                      </td>
                      <td className="py-4 pl-6 text-sm text-gray-800">
                        07-21-2023 <br />
                        <span className="text-red-500">Overdue</span>
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
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
                              <div className="rounded-md border border-gray-300 absolute py-3 px-6 -translate-x-[78px] z-10 bg-white">
                                <Menu.Item>
                                  {({ active }) => (
                                    <div
                                      className="text-left text-gray-800 cursor-pointer"
                                      onClick={() => setEditModal(true)}
                                    >
                                      Edit
                                    </div>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <div className="text-left text-gray-800 mt-2 cursor-pointer">
                                      Delete
                                    </div>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  ) : (
                    <tr className="h-10 border-b border-gray-200 w-full"></tr>
                  )}
                </tbody>
              </table> */}
              <TabTable tab={currentTab} locationId={locationId} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentTable
