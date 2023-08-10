import { Roboto } from "next/font/google"
import useProfile from "../../../hooks/users/useProfile"
import useSession from "../../../hooks/users/useSession"
import { useForm } from "react-hook-form"
import { I_UserUpdate, T_BACKEND_RESPONSE } from "../../../types/global"
import toast from "react-hot-toast"
import useUpdatePassword from "../../../hooks/users/useUpdatePassword"
import { useState } from "react"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const ChangePassword = () => {
  const session = useSession()
  const emailToken = session.data.item.email
  const token = session.data.item.token
  const { data, isLoading: basicInfoLoading } = useProfile(emailToken, token)

  const { register, handleSubmit, reset, control } = useForm<I_UserUpdate>()
  const { mutate, isLoading: updateInfoLoading } = useUpdatePassword(token)

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onSubmit = (data: I_UserUpdate) => {
    if (password === confirmPassword) {
      const callBackReq = {
        onSuccess: (data: T_BACKEND_RESPONSE) => {
          if (!data.error) {
            toast.success("New password has been saved.")
            console.log("New password has been saved.")
          } else {
            toast.error(data.message)
          }
        },
        onError: (err: any) => {
          toast.error(String(err))
        },
      }

      mutate(data, callBackReq)
    } else {
      console.log("Password doesn't match")
    }
  }

  return (
    <>
      {!basicInfoLoading ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7">
          {/*  */}
          <input
            type="hidden"
            {...register("id", { required: true })}
            defaultValue={data.item._id}
          />
          {/*  */}
          <h2 className="text-gray-800 text-[23px] font-semibold">
            Change Password
          </h2>
          <div className="bg-white border border-gray-200 rounded-sm mt-4">
            <div className="grid grid-cols-4 px-6 py-4 items-center">
              <div className="col-span-4 md:col-span-1">
                <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                  New Password
                </h4>
              </div>
              <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                <div>
                  <label htmlFor="new-password" className="sr-only">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...register("password", { required: true })}
                    disabled={updateInfoLoading}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    minLength={8}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 px-6 py-4 items-center border-t border-gray-200">
              <div className="col-span-4 md:col-span-1">
                <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                  Confirm Password
                </h4>
              </div>
              <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    disabled={updateInfoLoading}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    minLength={8}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end bg-light-blue py-4 px-6">
              <button
                type="submit"
                className="rounded-md w-full md:w-auto bg-cyan-500 mt-0 px-[38.5px] py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
                  "Submit"
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

export default ChangePassword
