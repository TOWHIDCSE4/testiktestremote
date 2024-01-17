"use client"
import { Fragment, useEffect } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  HeartIcon,
} from "@heroicons/react/20/solid"
import { onlineManager, useQueryClient } from "@tanstack/react-query"
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ClockIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline"
import { ChartBarIcon, LockClosedIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { Switch } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import SideBarNav from "./SideBarNav"
import DarkLogo from "../assets/logo/logo-dark.png"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import useLogout from "../hooks/users/useLogout"
import useProfile from "../hooks/users/useProfile"
import dayjs from "dayjs"
import { T_BackendResponse } from "custom-validator"
import { useSocket } from "../store/useSocket"
import cn from "classnames"
import { Button, Popover, Table } from "antd"

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

const MainNav = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [enabled, setEnabled] = useState(true)
  const [showSideNav, setShowSideNav] = useState(false)

  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()
  const { mutate } = useLogout()
  const isSocketConnected = useSocket((state) => state.isConnected)
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline())
  onlineManager.subscribe(() => {
    setIsOnline(onlineManager.isOnline())
  })

  const logoutUser = () => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["session"],
          })
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(undefined, callBackReq)
  }

  if (isUserProfileLoading) {
    return <div>Logging you in..</div>
  }
  console.log("TEST TEST", userProfile)

  return (
    <>
      <Disclosure
        as="nav"
        className="bg-light-cyan-blue shadow-lg fixed w-full z-40"
      >
        {({ open }) => (
          <>
            <div className="mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex md:px-0">
                  <div className="flex items-center mr-5 lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button
                      className="relative inline-flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 ml-2 md:mr-0"
                      onClick={() =>
                        setShowSideNav((showSideNav) => !showSideNav)
                      }
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>

                  <div className="items-center mr-4 flex">
                    <div className="relative h-10 w-52">
                      <Image src={DarkLogo} alt="logo" fill />
                    </div>
                  </div>
                  <div className="hidden lg:ml-6 lg:flex lg:space-x-10 items-center">
                    <div className="">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon
                            className="h-5 w-5 text-gray-900"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="search"
                          name="search"
                          className={`block w-56 rounded-md border-0 bg-alice-blue py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6`}
                          placeholder="Search..."
                          type="search"
                        />
                      </div>
                    </div>

                    <Switch.Group as="div" className="flex items-center">
                      <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={classNames(
                          enabled ? "bg-pale-aqua" : "bg-gray-200",
                          "relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-950 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            enabled ? "translate-x-4" : "translate-x-0",
                            "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                      <Switch.Label as="span" className="ml-3 text-sm">
                        <span className="font-medium text-gray-900"></span>
                      </Switch.Label>
                    </Switch.Group>
                  </div>
                </div>
                <div className="md:ml-4 flex items-center">
                  {/* Profile dropdown for medium to large screen*/}
                  <Menu
                    as="div"
                    className="relative ml-4 flex-shrink-0 hidden lg:block"
                  >
                    <div>
                      <Menu.Button className="relative flex rounded-full text-sm">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <div className="flex items-center">
                          <div className="relative h-9 w-9">
                            {!isUserProfileLoading &&
                            userProfile?.item?.profile?.photo ? (
                              <Image
                                className="rounded-full"
                                src={`/files/${userProfile?.item?.profile?.photo}`}
                                alt="Profile image"
                                fill
                              />
                            ) : !isUserProfileLoading &&
                              !userProfile?.item?.profile?.photo ? (
                              <Image
                                className="rounded-full"
                                src={`https://ui-avatars.com/api/?name=${userProfile?.item?.firstName}+${userProfile?.item?.lastName}`}
                                alt="Profile image"
                                fill
                              />
                            ) : (
                              <div className="animate-pulse flex space-x-4">
                                <div className="h-9 w-9 rounded-full bg-slate-200"></div>
                              </div>
                            )}
                          </div>
                          <div
                            className={`flex flex-col ml-4 items-start ${
                              isUserProfileLoading && "gap-2"
                            }`}
                          >
                            <span className="text-left font-bold text-indigo-blue text-[15px]">
                              {isUserProfileLoading ? (
                                <div className="animate-pulse flex space-x-4">
                                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                </div>
                              ) : (
                                (() => {
                                  if (
                                    userProfile?.item.profile &&
                                    userProfile?.item?.profile?.realNameDisplay
                                  ) {
                                    return (
                                      <>
                                        {userProfile?.item?.firstName}{" "}
                                        {userProfile?.item?.lastName}
                                      </>
                                    )
                                  } else if (
                                    userProfile?.item.profile === null
                                  ) {
                                    return (
                                      <>
                                        {userProfile?.item?.firstName}{" "}
                                        {userProfile?.item?.lastName}
                                      </>
                                    )
                                  } else {
                                    return (
                                      <>
                                        {userProfile?.item.profile?.profileName}
                                      </>
                                    )
                                  }
                                })()
                              )}
                            </span>
                            <span className="text-left text-gray-500 font-semibold">
                              {isUserProfileLoading ? (
                                <div className="animate-pulse flex space-x-4">
                                  <div className="h-3 w-24 bg-slate-200 rounded"></div>
                                </div>
                              ) : (
                                <>
                                  {userProfile?.item?.role === "Super"
                                    ? "Administrator"
                                    : userProfile?.item?.role}
                                </>
                              )}
                            </span>
                          </div>
                          <ChevronDownIcon className="h-4 w-4 ml-3" />
                        </div>
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              href="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-3 text-sm text-gray-600 border-b border-gray-200 font-medium"
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              onClick={() => logoutUser()}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-3 text-sm text-gray-600 font-medium cursor-pointer"
                              )}
                            >
                              Logout
                            </span>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                  <div className="md:space-x-5 flex items-center h-full ml-10">
                    <Link href="#">
                      <BellIcon className="h-6 w-6 text-indigo-blue mr-5 md:mr-0" />
                    </Link>
                    <Link href="#">
                      <ClockIcon className="h-6 w-6 text-indigo-blue mr-2 md:mr-0" />
                    </Link>
                    <span className="border-x h-full border-gray-300 hidden md:flex items-center">
                      <ChartBarIcon
                        className={cn("h-6 w-6 mx-2 ", {
                          "text-green-700": isOnline && isSocketConnected,
                          "text-slate-300": !isOnline || !isSocketConnected,
                        })}
                      />
                    </span>
                    <Popover
                      content={
                        <Table
                          pagination={false}
                          dataSource={[
                            {
                              key: "1",
                              name: "Mike",
                              age: 32,
                              address: "10 Downing Street",
                            },
                            {
                              key: "2",
                              name: "John",
                              age: 42,
                              address: "10 Downing Street",
                            },
                          ]}
                          columns={[
                            {
                              title: "Name",
                              dataIndex: "name",
                              key: "name",
                            },
                            {
                              title: "Age",
                              dataIndex: "age",
                              key: "age",
                            },
                            {
                              title: "Address",
                              dataIndex: "address",
                              key: "address",
                            },
                          ]}
                        />
                      }
                      // title="Title"
                      trigger="hover"
                    >
                      <Button type="link" ghost>
                        <CircleStackIcon className="h-6 w-6 text-indigo-blue hidden md:block" />
                      </Button>
                    </Popover>
                    <Link href="#"></Link>
                    <Link href="#">
                      <LockClosedIcon className="h-6 w-6 text-indigo-blue hidden md:block" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      <div className={`${showSideNav ? "block" : "hidden lg:block"} w-64`}>
        <SideBarNav />
      </div>
      <div className="p-4 w-full fixed bottom-0 bg-gray-200 lg:pl-72 flex items-center gap-2 justify-center z-20">
        © {dayjs().format("YYYY")} AmeriTex Pipe & Products, made with{" "}
        <HeartIcon className="h-5 w-5 text-red-500" /> by Ieko Media.
      </div>
    </>
  )
}

export default MainNav
