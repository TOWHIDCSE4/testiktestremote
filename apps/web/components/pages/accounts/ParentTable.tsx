import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useEffect, useState } from "react"
import combineClasses from "../../../helpers/combineClasses"
import { T_BackendResponse, T_User, T_UserRole } from "custom-validator"
import TabTable from "./TabTable"
import useGetUserRoleCount from "../../../hooks/users/useGetUserRoleCount"
import usePaginatedUsers from "../../../hooks/users/useGetPaginatedUsers"
import useProfile from "../../../hooks/users/useProfile"

const ParentTable = () => {
  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()
  const [currentTab, setCurrentTab] = useState<T_UserRole>("Personnel")
  const roles = ["Personnel", "Production", "Corporate", "Administrator"]
  const {
    data: userRoleCount,
    setRoles,
    isLoading: isUserRoleCountLoading,
  } = useGetUserRoleCount()
  useEffect(() => {
    setRoles(roles.map((role) => role) as string[])
  }, [setRoles])
  const tabs = userRoleCount?.map((role) => {
    return {
      name: role.item as string,
      count: role.itemCount as number,
      current: currentTab === role.item,
    }
  })

  const {
    data: users,
    isLoading: isUsersLoading,
    setRole,
    page,
    setPage,
  } = usePaginatedUsers()
  useEffect(() => {
    setRole(currentTab)
  }, [currentTab, setRole])

  const tabResults = tabs?.filter((tab) => currentTab === tab?.name)

  const numberOfPages = Math.ceil((users?.itemCount as number) / 10)

  return (
    <>
      <div
        className={`drop-shadow-lg border border-gray-200 bg-white rounded-md mt-7`}
      >
        <div>
          {isUserRoleCountLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-80 w-full bg-slate-200 rounded"></div>
            </div>
          ) : (
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
                        tabs?.find((tab) => tab.current).name
                      }
                      onChange={(e) => {
                        setCurrentTab(e.currentTarget.value as T_UserRole)
                      }}
                    >
                      {tabs?.map((tab) => (
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
                      {tabs?.map((tab, tabIdx) => (
                        <button
                          key={tab.name}
                          className={combineClasses(
                            tab.current
                              ? "text-gray-900"
                              : "text-gray-500 hover:text-gray-700",
                            tabIdx === 0 ? "" : "",
                            tabIdx === tabs?.length - 1 ? "" : "",
                            "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-bold hover:bg-gray-50 focus:z-10"
                          )}
                          aria-current={tab.current ? "page" : undefined}
                          onClick={() => setCurrentTab(tab.name as T_UserRole)}
                        >
                          <span>
                            {tab.name} ({tab.count})
                          </span>
                          <span
                            aria-hidden="true"
                            className={combineClasses(
                              tab.current ? "bg-blue-950" : "bg-transparent",
                              "absolute inset-x-0 bottom-0 h-1"
                            )}
                          />
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              {/* Table */}
              <div className="w-full flex flex-col-reverse overflow-x-auto">
                <div className="">
                  <div className="flex w-full h-20 items-center justify-between px-4 py-3 sm:px-6">
                    <div className="h-10 sm:hidden">
                      <a
                        href="#"
                        className="absolute left-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Previous
                      </a>
                      <a
                        href="#"
                        className="absolute right-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Next
                      </a>
                    </div>
                    <div className="hidden h-12 sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div className="absolute">
                        {isUserRoleCountLoading || isUsersLoading ? (
                          <div className="animate-pulse flex space-x-4">
                            <div className="h-4 w-48 bg-slate-200 rounded"></div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                              {tabResults && tabResults[0]?.count < 10
                                ? tabResults[0]?.count
                                : "10"}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                              {tabResults && tabResults[0]?.count}
                            </span>{" "}
                            results
                          </p>
                        )}
                      </div>
                      <div className="absolute z-0 right-7">
                        {isUsersLoading || isUserRoleCountLoading ? (
                          <div className="animate-pulse flex space-x-4">
                            <div className="h-8 w-36 bg-slate-200 rounded"></div>
                          </div>
                        ) : (
                          <nav
                            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                            aria-label="Pagination"
                          >
                            <button
                              onClick={() => setPage(page - 1)}
                              disabled={page === 1 || numberOfPages === 0}
                              className="relative disabled:opacity-70 inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                            >
                              <span className="sr-only">Previous</span>
                              <ChevronLeftIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                            {numberOfPages
                              ? [...Array(numberOfPages)].map((_, index) => (
                                  <button
                                    key={index + 1}
                                    onClick={() => setPage(index + 1)}
                                    className={
                                      page === index + 1
                                        ? "relative z-10 inline-flex items-center bg-blue-950 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    }
                                  >
                                    {index + 1}
                                  </button>
                                ))
                              : null}
                            <button
                              onClick={() => setPage(page + 1)}
                              className="relative disabled:opacity-70 inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              disabled={
                                page === numberOfPages || numberOfPages === 0
                              }
                            >
                              <span className="sr-only">Next</span>
                              <ChevronRightIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </nav>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <TabTable
                  tab={currentTab}
                  data={users as T_BackendResponse}
                  userId={userProfile?.item?._id as string}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ParentTable
