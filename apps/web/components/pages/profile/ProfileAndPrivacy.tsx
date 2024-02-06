import Image from "next/image"
import SingleImageUpload from "./SingleImageUpload"
import { useState } from "react"
import { FileWithPath } from "react-dropzone"
import useStoreSession from "../../../store/useStoreSession"
import useUpdateProfile from "../../../hooks/users/useUpdateProfile"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { T_BackendResponse, T_UserProfile } from "custom-validator"
import useProfile from "../../../hooks/users/useProfile"
import useUploadMediaFile from "../../../hooks/media/useUploadMediaFile"

const ProfileAndPrivacy = () => {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<(FileWithPath & { preview: string }) | null>(
    null
  )
  const storeSession = useStoreSession((state) => state)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()

  const { mutate: uploadMediaFile, isLoading: isUploadMediaFileLoading } =
    useUploadMediaFile()
  const { register, handleSubmit } = useForm<T_UserProfile>({
    values: {
      ...(userProfile?.item.profile as T_UserProfile),
      realNameDisplay: userProfile?.item.profile?.realNameDisplay || false,
      everyoneSeeProfile:
        userProfile?.item.profile?.everyoneSeeProfile || false,
    },
  })
  const { mutate, isLoading: updateInfoLoading } = useUpdateProfile()
  const onSubmit = (data: T_UserProfile) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          queryClient.invalidateQueries({
            queryKey: ["profile", storeSession.email],
          })
          toast.success("Profile information successfully updated")
          setFile(null)
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    const uploadFilesCallBackReq = {
      onSuccess: (returnData: T_BackendResponse) => {
        if (returnData?.item?.error) {
          toast.error("Some media files failed to upload")
          mutate(
            { _id: userProfile?.item._id as string, profile: data },
            callBackReq
          )
        } else {
          mutate(
            {
              _id: userProfile?.item._id as string,
              profile: { ...data, photo: returnData?.item?.name },
            },
            callBackReq
          )
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
        mutate(
          { _id: userProfile?.item._id as string, profile: data },
          callBackReq
        )
      },
    }
    if (file) {
      uploadMediaFile(file, uploadFilesCallBackReq)
    } else {
      mutate(
        { _id: userProfile?.item._id as string, profile: data },
        callBackReq
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7">
      <h2 className="text-gray-800 text-[23px] font-semibold">
        Profile & Privacy
      </h2>
      <div className="bg-white border border-gray-200 rounded-sm mt-4">
        <div className="grid grid-cols-4 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Your Photo
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 gap-3 flex items-center md:mt-0">
            <div className="relative h-16 w-16">
              {!isProfileLoading && file ? (
                <Image
                  className="rounded-md"
                  src={file?.preview}
                  alt="Profile image"
                  fill
                />
              ) : !isProfileLoading && userProfile?.item.profile?.photo ? (
                <Image
                  className="rounded-md"
                  src={`/files/${userProfile?.item.profile?.photo}`}
                  alt="Profile image"
                  fill
                />
              ) : !isProfileLoading && !userProfile?.item.profile?.photo ? (
                <Image
                  className="rounded-md"
                  src={`https://ui-avatars.com/api/?name=${userProfile?.item?.firstName}+${userProfile?.item?.lastName}`}
                  alt="Profile image"
                  fill
                />
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="h-16 w-16 rounded-md bg-slate-200"></div>
                </div>
              )}
            </div>
            <SingleImageUpload
              file={file}
              setFile={setFile}
              isLoading={
                updateInfoLoading ||
                isProfileLoading ||
                isUploadMediaFileLoading
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              Ameritex Profile Name
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div>
              <label htmlFor="profileName" className="sr-only">
                Ameritex Profile Name
              </label>
              <input
                type="text"
                id="profileName"
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  isUploadMediaFileLoading ||
                  userProfile?.item.role === "Personnel"
                }
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70`}
                placeholder="Your profile name..."
                {...register("profileName", { required: false })}
              />
            </div>
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-4 md:col-span-3">
            <p className={`text-[13px] text-gray-700 font-light mt-2`}>
              Your profile name will be used as part of your public profile URL
              address.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
          <div className="col-span-4 md:col-span-1">
            <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
              About You
            </h4>
          </div>
          <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
            <div className="">
              <textarea
                rows={3}
                id="aboutYou"
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  isUploadMediaFileLoading
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                placeholder="About you..."
                defaultValue={""}
                {...register("aboutYou", { required: true })}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="realNameDisplay"
                aria-describedby="display-description"
                type="checkbox"
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  isUploadMediaFileLoading
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("realNameDisplay")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label
                htmlFor="display-real-name"
                className="font-medium text-gray-800"
              >
                Display your real name on your profile
              </label>
              <p
                id="display-description"
                className="text-gray-700 text-[13px] font-light"
              >
                If unchecked, your profile name will be displayed instead of
                your full name.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="everyoneSeeProfile"
                aria-describedby="allow-view-description"
                type="checkbox"
                disabled={
                  updateInfoLoading ||
                  isProfileLoading ||
                  isUploadMediaFileLoading
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("everyoneSeeProfile")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label htmlFor="allow-view" className="font-medium text-gray-800">
                Allow everyone to see your profile
              </label>
              <p
                id="allow-view-description"
                className="text-gray-700 text-[13px] font-light"
              >
                If unchecked, your profile will be private and no one except you
                will able to view it.
              </p>
            </div>
          </div>
        </div>
        <div className="md:flex justify-end bg-light-blue py-4 px-6">
          <button
            type="submit"
            disabled={
              updateInfoLoading || isProfileLoading || isUploadMediaFileLoading
            }
            className="uppercase flex items-center rounded-md bg-cyan-500 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
          >
            {updateInfoLoading || isUploadMediaFileLoading ? (
              <div
                className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default ProfileAndPrivacy
