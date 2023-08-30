"use client"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import React, { Dispatch, useEffect, useState } from "react"
import combineClasses from "../helpers/combineClasses"
import Link from "next/link"
import { usePathname } from "next/navigation"
import path from "path"

type AccordionProps = {
  name: string
  slug: string
  children: {
    name: string
    href: string
  }[]
}

const Accordion = (props: {
  item: AccordionProps
  activePage: string
  setActivePage: Dispatch<string>
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const firstPath = pathname.split("/")[1]
    setIsOpen(firstPath === props.item.slug)
  }, [pathname, props.item.slug])

  useEffect(() => {
    const firstPath = pathname.split("/")[1]
    if (firstPath === props.item.slug) {
      props.setActivePage(props.item.slug)
    }
  }, [])

  useEffect(() => {
    if (props.activePage === props.item.slug) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [props.activePage])

  return (
    <div
      className={`cursor-pointer text-gray-500 p-2 w-72 ${
        isOpen && "bg-dark-cyan-blue"
      } rounded-r-lg`}
    >
      <div
        className="flex items-center gap-4 hover:text-white ml-2"
        onClick={() => {
          setIsOpen(!isOpen)
          props.setActivePage(props.item.slug)
        }}
      >
        <div className="flex items-center">
          <span
            className={`uppercase font-medium ml-8 ${
              isOpen ? "text-white" : ""
            }`}
          >
            {props.item.name}
          </span>
        </div>
        <ChevronRightIcon
          className={combineClasses(
            isOpen ? "rotate-90 text-white" : "text-gray-500",
            "ml-auto h-5 w-5 shrink-0"
          )}
          aria-hidden="true"
        />
      </div>
      {isOpen && (
        <div className="mt-1 ml-4 px-2">
          {props.item.children.map((subItem, index) => {
            return (
              <div key={index} className="flex items-center">
                {pathname === subItem.href && (
                  <div className="h-2.5 w-2.5 bg-red-700 rounded-full ml-4"></div>
                )}
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={combineClasses(
                    subItem.href === pathname
                      ? "text-white"
                      : "hover:text-white",
                    pathname === subItem.href ? "pl-4" : "ml-10",
                    "block rounded-md py-2 pr-2 leading-6 text-gray-500 font-medium"
                  )}
                >
                  {subItem.name}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Accordion
