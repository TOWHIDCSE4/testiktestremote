"use client"
import { IoDesktopSharp } from "react-icons/io5"

import { useQueryClient } from "@tanstack/react-query"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
import combineClasses from "../../../helpers/combineClasses"
import useUpdateUserProductionEye from "../../../hooks/users/useUpdateUserProductionEye"
import useStoreSession from "../../../store/useStoreSession"
import { useProductionEyeContext } from "./production-eye/productinEyeContext"

const ProductionEyeDesktopMode: React.FC = () => {
  const queryClient = useQueryClient()
  const storeSession = useStoreSession((state) => state)
  const { data, mutate } = useUpdateUserProductionEye()

  const { isMobile, setIsMobile, userProfile } = useProductionEyeContext()

  const onSubmit = () => {
    // router.replace("/profile-home")
    mutate({
      ...userProfile?.item,
      // @ts-ignore
      defaultSettings: {
        ...userProfile?.item?.defaultSettings,
        viewMode: "desktop",
      },
    })
    // queryClient.invalidateQueries(["profile", storeSession.email])
    toast.success("View mode updated to desktop")
  }

  useEffect(() => {
    if (data) {
      setIsMobile(data.item.defaultSettings.viewMode)
    }
  }, [data])

  // console.log("data__", data)

  return (
    <IoDesktopSharp
      onClick={onSubmit}
      className={combineClasses(
        "w-full h-12 p-2 text-center bg-gray-400 rounded-md hover:bg-gray-600 hover:text-white cursor-pointer",
        isMobile === "desktop" ? "bg-gray-600 text-white" : "bg-gray-400"
      )}
    />
  )
}

export default ProductionEyeDesktopMode
