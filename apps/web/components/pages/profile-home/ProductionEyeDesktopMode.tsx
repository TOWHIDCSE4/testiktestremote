"use client"
import { IoDesktopSharp } from "react-icons/io5"

import React from "react"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"
import combineClasses from "../../../helpers/combineClasses"

const ProductionEyeDesktopMode: React.FC = () => {
  const { isMobile, setIsMobile } = useProductionEyeContext()

  return (
    <IoDesktopSharp
      onClick={() => setIsMobile(false)}
      className={combineClasses(
        "w-full h-12 p-2 text-center bg-gray-400 rounded-md hover:bg-gray-600 hover:text-white cursor-pointer",
        !isMobile ? "bg-gray-600 text-white" : "bg-gray-400"
      )}
    />
  )
}

export default ProductionEyeDesktopMode
