"use client"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { ChevronRightIcon } from "@heroicons/react/20/solid"
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import { Fragment, useState } from "react"
import { Roboto } from "next/font/google"
import Link from "next/link"
import useLogout from "../hooks/users/useLogout"
import { T_BACKEND_RESPONSE } from "../types/global"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["cyrillic"],
})

const navigation = [
  { name: "Profile Home", href: "#", current: true },
  {
    name: "Order Flow",
    current: false,
    children: [
      { name: "Project Dashboard", href: "#" },
      { name: "Projects", href: "#" },
      { name: "Drafting", href: "#" },
      { name: "Inventory", href: "#" },
      { name: "Production Tracker", href: "#" },
      { name: "Load out", href: "#" },
      { name: "Project Close", href: "#" },
    ],
  },
  {
    name: "Production",
    current: false,
    children: [
      { name: "Timer", href: "#" },
      { name: "System Check", href: "#" },
      { name: "Product List", href: "#" },
    ],
  },
  {
    name: "Operations",
    current: false,
    children: [
      { name: "Operations Dashboard", href: "#" },
      { name: "Quality Control", href: "#" },
      { name: "Maintenance", href: "#" },
      { name: "Safety 101", href: "#" },
      { name: "Forms", href: "#" },
      { name: "Line Data", href: "#" },
      { name: "FIXX", href: "#" },
    ],
  },
  {
    name: "Human Resources",
    current: false,
    children: [
      { name: "HR Dashboard", href: "#" },
      { name: "Gallery", href: "#" },
      { name: "Device Checkout", href: "#" },
      { name: "ADT", href: "#" },
      { name: "Down Time", href: "#" },
      { name: "Community", href: "#" },
      { name: "Msg / Discussions", href: "#" },
    ],
  },
  {
    name: "Accounting",
    current: false,
    children: [{ name: "Accounting Dashboard", href: "#" }],
  },
  {
    name: "Sales",
    current: false,
    children: [{ name: "Sales Dashboard", href: "#" }],
  },
  { name: "Team Members", href: "#", current: false },
]

// @ts-expect-error
function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const SideBarNav = () => {
  const [openItem, setOpenItem] = useState(null)
  const router = useRouter()

  const { mutate } = useLogout()
  const logoutUser = () => {
    const callBackReq = {
      onSuccess: (data: T_BACKEND_RESPONSE) => {
        if (!data.error) {
          Cookies.remove("tfl")
          router.push(`/`)
        } else {
          toast.error(data.message)
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(undefined, callBackReq)
  }

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-dark-blue px-4 fixed h-full mt-16 z-10">
      <Menu
        as="div"
        className="flex lg:hidden items-center bg-white px-3 py-1.5 w-full rounded-full mt-7 relative"
      >
        <Menu.Button>
          <div className="flex items-center">
            <div className="relative h-9 w-9">
              <Image
                className="rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Profile image"
                fill
              />
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-left font-bold text-gray-600 text-[15px] leading-5">
                Dylan Lorenz
              </span>
              <span className="text-left text-gray-500 font-semibold text-sm leading-5">
                Administrator
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
      <div className="lg:hidden">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className={`relative ${roboto.className}`}>
          <input
            id="search"
            name="search"
            className="block text-sm w-56 rounded-md border-0 bg-alice-blue py-2 pl-4 pr-3 text-white bg-dark-cyan-blue placeholder:text-gray-400"
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
      <nav className={`flex flex-1 flex-col lg:mt-7 ${roboto.className}`}>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "text-white"
                          : "hover:text-white text-gray-500",
                        "group flex gap-x-3 rounded-md p-2 leading-6 font-medium uppercase"
                      )}
                    >
                      {item.current ? (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 bg-red-700 rounded-full ml-1"></div>
                          <span className="ml-[18.5px]">{item.name}</span>
                        </div>
                      ) : (
                        <span className="ml-8">{item.name}</span>
                      )}
                    </a>
                  ) : (
                    <Disclosure as="div">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              item.current
                                ? "text-white"
                                : open
                                ? "text-white"
                                : "hover:text-white",
                              "flex items-center w-full text-left rounded-md pl-2 pr-2 py-2 gap-x-3 leading-6 font-medium text-gray-500 uppercase"
                            )}
                          >
                            {item.current ? (
                              <div className="flex items-center">
                                <div className="h-2.5 w-2.5 bg-red-700 rounded-full ml-1"></div>
                                <span className="ml-[18.5px]">{item.name}</span>
                              </div>
                            ) : (
                              <span className="ml-8">{item.name}</span>
                            )}
                            <ChevronRightIcon
                              className={classNames(
                                open ? "rotate-90 text-white" : "text-gray-500",
                                "ml-auto h-5 w-5 shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel as="ul" className="mt-1 ml-4 px-2">
                            {item.children.map((subItem) => (
                              <li key={subItem.name}>
                                {/* 44px */}
                                <Disclosure.Button
                                  as="a"
                                  href={subItem.href}
                                  className={classNames(
                                    // @ts-expect-error
                                    subItem.current
                                      ? "text-white"
                                      : "hover:text-white",
                                    "block rounded-md py-2 pr-2 pl-9 leading-6 text-gray-500 font-medium"
                                  )}
                                >
                                  {subItem.name}
                                </Disclosure.Button>
                              </li>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default SideBarNav
