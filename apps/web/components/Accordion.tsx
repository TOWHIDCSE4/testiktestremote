"use client"
import { ChevronRightIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from "react"
import combineClasses from "../helpers/combineClasses"
import Link from "next/link"
import { usePathname } from "next/navigation"

type AccordionProps = {
  name: string
  slug: string
  children: {
    name: string
    href: string
  }[]
}

const Accordion = (props: { item: AccordionProps }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const firstPath = pathname.split("/")[1]
    setIsOpen(firstPath === props.item.slug)
  }, [pathname, props.item.slug])

  const firstPath = pathname.split("/")[1]
  const isPageSelected = firstPath === props.item.slug

  return (
    <div
      className={`cursor-pointer text-gray-500 p-2 w-72 ${
        isOpen && "bg-dark-cyan-blue"
      } rounded-r-lg`}
    >
      <div
        className="flex items-center gap-4 hover:text-white ml-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {isPageSelected && (
            <div className="h-2.5 w-2.5 bg-red-700 rounded-full ml-1"></div>
          )}
          <span
            className={`uppercase font-medium ${isOpen ? "text-white" : ""} ${
              isPageSelected ? "ml-5" : "ml-8"
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
          {props.item.children.map((subItem) => (
            <Link
              key={subItem.name}
              href={subItem.href}
              className={combineClasses(
                subItem.href === pathname ? "text-white" : "hover:text-white",
                "block rounded-md py-2 pr-2 pl-9 leading-6 text-gray-500 font-medium"
              )}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Accordion
