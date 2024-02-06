import useStoreSession from "../../../store/useStoreSession"
import useUpdateProfile from "../../../hooks/users/useUpdateProfile"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { T_BackendResponse, T_UserProfile } from "custom-validator"
import useProfile from "../../../hooks/users/useProfile"

const Updates = () => {
  const queryClient = useQueryClient()
  const storeSession = useStoreSession((state) => state)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const { register, handleSubmit } = useForm<T_UserProfile>({
    values: {
      ...(userProfile?.item.profile as T_UserProfile),
      newsletter: userProfile?.item.profile?.newsletter || false,
      newContentReleases:
        userProfile?.item.profile?.newContentReleases || false,
      productUpdate: userProfile?.item.profile?.productUpdate || false,
      emailsFromTeam: userProfile?.item.profile?.emailsFromTeam || false,
      contentSuggestion: userProfile?.item.profile?.contentSuggestion || false,
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
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate({ _id: userProfile?.item._id as string, profile: data }, callBackReq)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7">
      <h2 className="text-gray-800 text-[23px] font-semibold">
        Updates from Ameritex
      </h2>
      <div className="bg-white border border-gray-200 rounded-sm mt-4">
        <div className="px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="newsletter"
                aria-describedby="newsletter-description"
                type="checkbox"
                disabled={updateInfoLoading || isProfileLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("newsletter")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label htmlFor="newsletter" className="font-medium text-gray-800">
                Ameritex Newsletter
              </label>
              <p
                id="newsletter-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Get the latest on company news.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="newContentReleases"
                aria-describedby="new-content-description"
                type="checkbox"
                disabled={updateInfoLoading || isProfileLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("newContentReleases")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label
                htmlFor="newContentReleases"
                className="font-medium text-gray-800"
              >
                New Content Releases
              </label>
              <p
                id="new-content-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Send me an email when new courses or bonus content is released.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="productUpdate"
                aria-describedby="pf-updates-description"
                type="checkbox"
                disabled={updateInfoLoading || isProfileLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("productUpdate")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label
                htmlFor="productUpdate"
                className="font-medium text-gray-800"
              >
                Product & Feature Updates
              </label>
              <p
                id="pf-updates-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Be the first to know when we announce new features and updates.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="emails"
                aria-describedby="emails-description"
                type="checkbox"
                disabled={updateInfoLoading || isProfileLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("emailsFromTeam")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label
                htmlFor="emailFromTeam"
                className="font-medium text-gray-800"
              >
                Emails from Team Members
              </label>
              <p
                id="emails-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Get messages, encouragement and helpful information from your
                teachers.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-3">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="content-suggestions"
                aria-describedby="content-suggestions-description"
                type="checkbox"
                disabled={updateInfoLoading || isProfileLoading}
                className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                {...register("contentSuggestion")}
              />
            </div>
            <div className={`ml-3 text-sm leading-6`}>
              <label
                htmlFor="contentSuggestion"
                className="font-medium text-gray-800"
              >
                Content Suggestions
              </label>
              <p
                id="content-suggestions-description"
                className="text-gray-700 text-[13px] font-light"
              >
                Get daily content suggestions to keep you on track.
              </p>
            </div>
          </div>
        </div>
        <div className="md:flex justify-end bg-light-blue py-4 px-6">
          <button
            type="submit"
            disabled={updateInfoLoading || isProfileLoading}
            className="uppercase flex items-center rounded-md bg-cyan-500 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
          >
            {updateInfoLoading ? (
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

export default Updates
