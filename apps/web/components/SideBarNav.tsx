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
import isDev from "../helpers/isDev"

const navigation: Array<{
  name: string
  slug: string
  href?: string
  showOnLive?: boolean
  showOnlyFor?: Array<string>
  children?: Array<{
    name: string
    href: string
    showOnLive?: boolean
    showOnlyFor?: Array<string>
  }>
}> = [
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
    showOnLive: true,
    children: [
      { name: "Timer", href: "/production/timer" },
      { name: "Analytics", href: "/production/analytics", showOnLive: true },
      { name: "Dev Ops", href: "/production/dev-ops", showOnLive: false },
      {
        name: "System Check",
        href: "/production/system-check",
        showOnLive: false,
      },
      { name: "Product List", href: "/production/product-list" },
    ],
  },
  {
    name: "AI Operations",
    slug: "ai-operations",
    href: "/ai-operations",
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
      {
        name: "Device Checkout",
        href: "/human-resources/device-checkout",
        showOnLive: true,
        showOnlyFor: [
          USER_ROLES.Super,
          USER_ROLES.Administrator,
          USER_ROLES.HR,
          USER_ROLES.HR_Director,
          USER_ROLES.Production,
        ],
      },
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
      USER_ROLES.HR_Director,
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
    <div className="fixed top-0 z-30 flex flex-col h-full pr-4 mt-16 overflow-y-auto border-r border-gray-200 grow gap-y-5 bg-dark-blue">
      <div className="ml-4 lg:hidden">
        <Menu
          as="div"
          className="flex items-center bg-white px-3 py-1.5 w-full rounded-full mt-7 relative"
        >
          <Menu.Button>
            <div className="flex items-center">
              <div className="relative h-9 w-9">
                {isUserProfileLoading ? (
                  <div className="flex space-x-4 animate-pulse">
                    <div className="rounded-full h-9 w-9 bg-slate-200"></div>
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
                    <div className="flex space-x-4 animate-pulse">
                      <div className="w-24 h-3 rounded bg-slate-200"></div>
                    </div>
                  ) : (
                    <>
                      {userProfile?.item?.firstName}{" "}
                      {userProfile?.item?.lastName}
                    </>
                  )}
                </span>
                <span className="text-sm font-semibold leading-5 text-left text-gray-500">
                  {isUserProfileLoading ? (
                    <div className="flex space-x-4 animate-pulse">
                      <div className="w-24 h-3 rounded bg-slate-200"></div>
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
              <ChevronDownIcon className="absolute w-3 h-3 right-5" />
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
            <Menu.Items className="absolute right-0 z-10 w-full mt-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
              className="block w-56 py-2 pl-4 pr-3 text-sm text-white border-0 rounded-md bg-dark-cyan-blue placeholder:text-gray-400"
              placeholder="Search..."
              type="search"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <MagnifyingGlassIcon
                className="w-4 h-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
      <nav className={`flex flex-1 flex-col lg:mt-7`}>
        <ul role="list" className="flex flex-col flex-1 gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item, index) => {
                const currentUserRole = storeSession?.role
                const willShowForRole = item.showOnlyFor?.find(
                  (item) => item === currentUserRole
                )
                const willShowOnCurrentEnv =
                  !isDev && typeof item.showOnLive === "boolean"
                    ? item.showOnLive
                    : true
                const willShow = willShowForRole && willShowOnCurrentEnv
                if (!item.showOnlyFor || willShow) {
                  return (
                    <li key={item.name}>
                      {!item.children ? (
                        <Link
                          href={item.href ?? "#"}
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
                          item={{
                            ...item,
                            children: item.children.filter((child) => {
                              const willShowForRole = child.showOnlyFor
                                ? child.showOnlyFor.some(
                                    (role) => role === currentUserRole
                                  )
                                : true
                              const willShowOnCurrentEnv =
                                !isDev && typeof child.showOnLive === "boolean"
                                  ? child.showOnLive
                                  : true
                              return willShowForRole && willShowOnCurrentEnv
                            }),
                          }}
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
