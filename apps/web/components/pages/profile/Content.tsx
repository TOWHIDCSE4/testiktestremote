"use client"
import { Roboto } from "next/font/google"
import BasicInformation from "./BasicInformation"
import ProfileAndPrivacy from "./ProfileAndPrivacy"
import Updates from "./Updates"
import ChangePassword from "./ChangePassword"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const Content = () => {
  return (
    <>
      <div className={`my-20`}>
        <div className="content px-4 md:px-7 lg:px-16 2xl:px-80 mt-28">
          <h2 className="text-gray-800 text-[33px] font-semibold">
            My Profile
          </h2>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest">
            Overview<span className="text-black mx-2">&gt;</span>
            <span className="text-red-500">Edit Account</span>
          </h4>
          <div className="w-full h-0.5 bg-gray-200 mt-12"></div>
          <BasicInformation />
          <ProfileAndPrivacy />
          <Updates />
          <ChangePassword />
        </div>
      </div>
    </>
  )
}

export default Content
