"use client"
import { Roboto } from "next/font/google"
import BasicInformation from "./BasicInformation"
import ProfileAndPrivacy from "./ProfileAndPrivacy"
import Updates from "./Updates"
import ChangePassword from "./ChangePassword"
import useStoreSession from "../../../store/useStoreSession"
import useProfile from "../../../hooks/users/useProfile"

const Content = () => {
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  return (
    <>
      <div className={`my-20 pb-10`}>
        <div className="content px-4 md:px-7 lg:px-16 2xl:px-44 2xl:max-w-7xl mx-auto mt-28">
          <h2 className="text-gray-800 text-[33px] font-semibold">
            {userProfile?.item.firstName} {userProfile?.item.lastName}
            {isProfileLoading && (
              <div className="animate-pulse flex space-x-4 my-3">
                <div className="h-10 w-52 rounded-md bg-slate-200"></div>
              </div>
            )}
          </h2>
          <h4 className="uppercase text-sm text-gray-500 font-medium tracking-widest">
            Profile<span className="text-black mx-2">&gt;</span>
            <span className="text-red-500">Edit Account</span>
          </h4>
          <div className="w-full h-0.5 bg-gray-200 mt-6"></div>
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
