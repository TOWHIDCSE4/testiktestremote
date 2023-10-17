"use client"
import { Menu, Transition } from "@headlessui/react"
import { useQueryClient } from "@tanstack/react-query"
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import React, { Fragment, useState } from "react"
import Link from "next/link"
import useLogout from "../hooks/users/useLogout"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { usePathname } from "next/navigation"
import combineClasses from "../helpers/combineClasses"
import Accordion from "./Accordion"
import useProfile from "../hooks/users/useProfile"
import { USER_ROLES } from "../helpers/constants"
import useStoreSession from "../store/useStoreSession"
import { T_BackendResponse } from "custom-validator"

const navigation = [
  { name: "Profile Home", slug: "profile-home", href: "/profile-home" },
  {
    name: "Order Flow",
    slug: "order-flow",
    children: [
      { name: "Project Dashboard", href: "/order-flow/project-dashboard" },
      { name: "Projects", href: "/order-flow/projects" },
      { name: "Drafting", href: "/order-flow/drafting" },
      { name: "Inventory", href: "/order-flow/inventory" },
      { name: "Production Tracker", href: "/order-flow/production-tracker" },
      { name: "Load out", href: "/order-flow/load-out" },
      { name: "Project Close", href: "/order-flow/project-close" },
    ],
  },
  {
    name: "Production",
    slug: "production",
    children: [
      { name: "Timer", href: "/production/timer" },
      { name: "System Check", href: "/production/system-check" },
      { name: "Product List", href: "/production/product-list" },
    ],
  },
  {
    name: "Operations",
    slug: "operations",
    children: [
      {
        name: "Operations Dashboard",
        href: "/operations/operations-dashboard",
      },
      { name: "Quality Control", href: "/operations/quality-control" },
      { name: "Maintenance", href: "/operations/maintenance" },
      { name: "Safety 101", href: "/operations/safety-101" },
      { name: "Forms", href: "/operations/forms" },
      { name: "Line Data", href: "/operations/line-data" },
      { name: "FIXX", href: "/operations/fixx" },
    ],
  },
  {
    name: "Human Resources",
    slug: "human-resources",
    children: [
      { name: "HR Dashboard", href: "/human-resources/hr-dashboard" },
      { name: "Gallery", href: "/human-resources/gallery" },
      { name: "Device Checkout", href: "/human-resources/device-checkout" },
      { name: "ADT", href: "/human-resources/adt" },
      { name: "Down Time", href: "/human-resources/down-time" },
      { name: "Community", href: "/human-resources/community" },
      { name: "Msg / Discussions", href: "/human-resources/msg-discussion" },
    ],
  },
  {
    name: "Accounting",
    slug: "accounting",
    children: [
      {
        name: "Accounting Dashboard",
        href: "/accounting/accounting-dashboard",
      },
    ],
  },
  {
    name: "Sales",
    slug: "sales",
    children: [{ name: "Sales Dashboard", href: "/sales/sales-dashboard" }],
  },
  {
    name: "Team Members",
    slug: "team-members",
    href: "/team-members",
    showOnlyFor: [
      USER_ROLES.Super,
      USER_ROLES.Administrator,
      USER_ROLES.HR,
      USER_ROLES.Production,
    ],
  },
]

const SideBarNav = () => {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const router = useRouter()
  const storeSession = useStoreSession((state) => state)
  const { data: userProfile, isLoading: isUserProfileLoading } = useProfile()
  const [activePage, setActivePage] = useState("")
  const { mutate } = useLogout()
  const logoutUser = () => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["session"],
          })
          Cookies.remove("tfl")
          router.push(`/`)
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
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-dark-blue pr-4 fixed h-full mt-16 z-30">
      <div className="lg:hidden ml-4">
        <Menu
          as="div"
          className="flex items-center bg-white px-3 py-1.5 w-full rounded-full mt-7 relative"
        >
          <Menu.Button>
            <div className="flex items-center">
              <div className="relative h-9 w-9">
                {isUserProfileLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-9 w-9 rounded-full bg-slate-200"></div>
                  </div>
                ) : (
                  <Image
                    className="rounded-full"
                    src={`https://ui-avatars.com/api/?name=${userProfile?.item?.firstName}+${userProfile?.item?.lastName}`}
                    alt="Profile image"
                    fill
                  />
                )}
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-left font-bold text-gray-600 text-[15px] leading-5">
                  {isUserProfileLoading ? (
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-3 w-24 bg-slate-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      {userProfile?.item?.firstName}{" "}
                      {userProfile?.item?.lastName}
                    </>
                  )}
                </span>
                <span className="text-left text-gray-500 font-semibold text-sm leading-5">
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
              <ChevronDownIcon className="h-3 w-3 absolute right-5" />
            </div>
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
            <Menu.Items className="absolute right-0 z-10 mt-40 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profile"
                    className={combineClasses(
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
                    className={combineClasses(
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
        <div className="mt-4">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className={`relative`}>
            <input
              id="search"
              name="search"
              className="block text-sm w-56 rounded-md border-0 py-2 pl-4 pr-3 text-white bg-dark-cyan-blue placeholder:text-gray-400"
              placeholder="Search..."
              type="search"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
      <nav className={`flex flex-1 flex-col lg:mt-7`}>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item, index) => {
                const currentUserRole = storeSession?.role
                const willShow = item.showOnlyFor?.find(
                  (item) => item === currentUserRole
                )
                if (!item.showOnlyFor || willShow) {
                  return (
                    <li key={item.name}>
                      {!item.children ? (
                        <Link
                          href={item.href}
                          className={combineClasses(
                            item.href === pathname
                              ? "text-white"
                              : "hover:text-white text-gray-500",
                            item.href === pathname ? "ml-[6px]" : "ml-2",
                            "group flex gap-x-3 rounded-md p-2 leading-6 font-medium uppercase"
                          )}
                        >
                          {item.href === pathname ? (
                            <div className="flex items-center">
                              <div className="h-2.5 w-2.5 bg-red-700 rounded-full ml-1"></div>
                              <span className="ml-5">{item.name}</span>
                            </div>
                          ) : (
                            <span className="ml-8">{item.name}</span>
                          )}
                        </Link>
                      ) : (
                        <Accordion
                          item={item}
                          activePage={activePage}
                          setActivePage={setActivePage}
                        />
                      )}
                    </li>
                  )
                }
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default SideBarNav
