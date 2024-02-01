"use client"
import React from "react"
import { FaMobileScreenButton } from "react-icons/fa6"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"
import combineClasses from "../../../helpers/combineClasses"

const ProductionEyeMobileMode: React.FC = () => {
  const { isMobile, setIsMobile } = useProductionEyeContext()
  return (
    <FaMobileScreenButton
      onClick={() => setIsMobile(true)}
      className={combineClasses(
        "w-full h-12 p-2 text-center bg-gray-400 rounded-md hover:bg-gray-600 hover:text-white cursor-pointer",
        isMobile ? "bg-gray-600 text-white" : "bg-gray-400"
      )}
    />
  )
}

export default ProductionEyeMobileMode
