import { Roboto } from "next/font/google"
import useProfile from "../../../hooks/users/useProfile"
import useSession from "../../../hooks/users/useSession"
import { useForm } from "react-hook-form"
import { I_UserUpdate, T_BACKEND_RESPONSE } from "../../../types/global"
import toast from "react-hot-toast"
import useUpdateBasicInfo from "../../../hooks/users/useUpdateProfile"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const BasicInformation = () => {
  const session = useSession()
  const emailToken = session.data.item.email
  const token = session.data.item.token
  const { data, isLoading: basicInfoLoading } = useProfile(emailToken, token)

  const { register, handleSubmit } = useForm<I_UserUpdate>()
  const { mutate, isLoading: updateInfoLoading } = useUpdateBasicInfo(token)

  const onSubmit = (data: I_UserUpdate) => {
    const callBackReq = {
      onSuccess: (data: T_BACKEND_RESPONSE) => {
        if (!data.error) {
          toast.success("Profile information successfully updated")
        } else {
          toast.error(data.message)
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }

    mutate(data, callBackReq)
  }

  const renderBasicInfo = () => {
    return (
      <>
        {!basicInfoLoading ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
            <h2 className="text-gray-800 text-[23px] font-semibold">
              Basic Information
            </h2>
            <div className="bg-white border border-gray-200 rounded-sm mt-4">
              {/*  */}
              <input
                type="hidden"
                {...register("id", { required: true })}
                defaultValue={data.item._id}
              />
              {/*  */}
              <div className="grid grid-cols-4 px-6 py-4 items-center">
                <div className="col-span-4 md:col-span-1">
                  <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                    First Name
                  </h4>
                </div>
                <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                  <div>
                    <label htmlFor="first-name" className="sr-only">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register("firstName", { required: true })}
                      disabled={updateInfoLoading}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                      defaultValue={data.item.firstName}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
                <div className="col-span-4 md:col-span-1">
                  <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                    Last Name
                  </h4>
                </div>
                <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                  <div>
                    <label htmlFor="last-name" className="sr-only">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...register("lastName", { required: true })}
                      disabled={updateInfoLoading}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                      defaultValue={data.item.lastName}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
                <div className="col-span-4 md:col-span-1">
                  <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                    Email Address
                  </h4>
                </div>
                <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      disabled={updateInfoLoading}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                      defaultValue={data.item.email}
                    />
                  </div>
                  <p
                    className={`text-[13px] text-gray-700 font-light mt-4 ${roboto.className}`}
                  >
                    Note that if you change your email, you will have to confirm
                    it again.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-gray-200 px-6 py-4 items-center">
                <div className="col-span-4 md:col-span-1">
                  <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                    Factory
                  </h4>
                </div>
                <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                  <div>
                    <label htmlFor="factory" className="sr-only">
                      Factory
                    </label>
                    <input
                      type="text"
                      disabled={updateInfoLoading}
                      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                      placeholder="Your factory name..."
                    />
                  </div>
                </div>
              </div>
              <div className="md:flex justify-between bg-light-blue py-4 px-6">
                <div className="md:ml-3">
                  <h4 className="text-lg text-gray-900 text-center md:text-left">
                    <span className={roboto.className}>approved body</span>{" "}
                    <span className="text-red-500">Rocky Lorenz</span>
                  </h4>
                </div>
                <button
                  type="submit"
                  className="uppercase rounded-md bg-cyan-500 mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  disabled={updateInfoLoading}
                >
                  {updateInfoLoading ? (
                    <div
                      className="animate-spin inline-block w-[10px] h-[10px] border-[2px] border-current border-t-transparent text-white rounded-full"
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
        ) : (
          <></>
        )}
      </>
    )
  }

  return <>{renderBasicInfo()}</>
}

export default BasicInformation
