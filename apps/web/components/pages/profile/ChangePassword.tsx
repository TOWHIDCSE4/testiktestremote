import { Roboto } from "next/font/google"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import useProfile from "../../../hooks/users/useProfile"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import useUpdatePassword from "../../../hooks/users/useUpdatePassword"
import { useState } from "react"
import { T_BackendResponse, T_UserPassword } from "custom-validator"

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { data, isLoading: basicInfoLoading } = useProfile()
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
  const { register, handleSubmit, reset } = useForm<T_UserPassword>({
    values: { _id: data?.item._id, password: "" },
  })
  const { mutate, isLoading: updateInfoLoading } = useUpdatePassword()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onSubmit = (data: T_UserPassword) => {
    if (password === confirmPassword) {
      const callBackReq = {
        onSuccess: (data: T_BackendResponse) => {
          if (!data.error) {
            toast.success("New password has been saved.")
            reset()
          } else {
            toast.error(String(data.message))
          }
        },
        onError: (err: any) => {
          toast.error(String(err))
        },
      }
      mutate(data, callBackReq)
    } else {
      toast.error("Password doesn't match")
    }
  }

  return (
    <>
      {!basicInfoLoading ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7">
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
                <div className="relative">
                  <label htmlFor="new-password" className="sr-only">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    {...register("password", { required: true })}
                    disabled={updateInfoLoading}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                    placeholder="Enter new password"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="grid grid-cols-4 px-6 py-4 items-center border-t border-gray-200">
              <div className="col-span-4 md:col-span-1">
                <h4 className="text-sm uppercase text-gray-800 font-semibold tracking-wider">
                  Confirm Password
                </h4>
              </div>
              <div className="col-span-4 md:col-span-3 mt-2 md:mt-0">
                <div className="relative">
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    disabled={updateInfoLoading}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70 ${roboto.className}`}
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end bg-light-blue py-4 px-6">
              <button
                type="submit"
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
