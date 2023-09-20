"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import DarkLogo from "../../../assets/logo/logo-dark.png"
import Slider from "../../Slider"
import { useForm } from "react-hook-form"
import useRegister from "../../../hooks/users/useRegister"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { T_BackendResponse, T_User } from "custom-validator"
import { USER_ROLES } from "../../../helpers/constants"
import useLocations from "../../../hooks/locations/useLocations"

const Content = () => {
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const [password, setPassword] = useState("")
  const [confirmPass, setConfirmPass] = useState("")

  const { register, handleSubmit, reset } = useForm<T_User>()
  const { mutate, isLoading } = useRegister()

  const router = useRouter()

  const onSubmit = (data: T_User) => {
    if (password === confirmPass) {
      const callBackReq = {
        onSuccess: (data: T_BackendResponse) => {
          if (!data.error) {
            router.push("/")
            resetForm()
          } else {
            toast.error(String(data.message))
          }
        },
        onError: (err: any) => {
          toast.error(String(err))
        },
      }

      mutate({ ...data, status: "Requested" }, callBackReq)
    } else {
      toast.error("Password doesn't match")
    }
  }

  const resetForm = () => {
    reset()
    setPassword("")
    setConfirmPass("")
  }

  const ARR_USER_ROLES = [
    USER_ROLES.Administrator,
    USER_ROLES.Production,
    USER_ROLES.Personnel,
    USER_ROLES.Corporate,
    USER_ROLES.HR,
    USER_ROLES.Accounting,
    USER_ROLES.Sales,
  ]

  return (
    <>
      <div className="flex min-h-screen flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <div className="relative h-16 w-80 mx-auto">
                <Image src={DarkLogo} alt="logo" fill />
              </div>
              <h2 className="mt-2 text-md text-center font-bold leading-9 tracking-tight text-gray-900">
                Welcome
              </h2>
              <p className="text-sm font-semibold text-gray-900 text-center">
                Sign up to APMS
              </p>
            </div>
            {/* Registration form */}
            <div className="mt-8">
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-x-3">
                    <div>
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="first-name"
                          {...register("firstName", { required: true })}
                          type="text"
                          required
                          disabled={isLoading}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                          placeholder="First Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last Name
                      </label>
                      <div className="mt-2">
                        <input
                          id="last-name"
                          {...register("lastName", { required: true })}
                          type="text"
                          required
                          disabled={isLoading}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Department
                    </label>
                    <select
                      id="role"
                      disabled={isLoading}
                      required
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                      {...register("role", { required: true })}
                      defaultValue=""
                    >
                      <option className="uppercase" value="">
                        Select Department
                      </option>
                      {ARR_USER_ROLES.map((key: string) => (
                        <option className="uppercase" key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Location
                    </label>
                    <select
                      id="location"
                      required
                      disabled={isLocationsLoading || isLoading}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                      {...register("locationId", { required: true })}
                      defaultValue=""
                    >
                      <option className="uppercase" value="">
                        Select Location
                      </option>
                      {locations?.items.map((key, index) => (
                        <option
                          className="uppercase"
                          key={index}
                          value={key._id}
                        >
                          {key.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="email-add"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email-add"
                        {...register("email", { required: true })}
                        disabled={isLoading}
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="reg-pass"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="reg-pass"
                        {...register("password", { required: true })}
                        disabled={isLoading}
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="confirm-pass"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="confirm-pass"
                        type="password"
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        placeholder="Confirm Password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <div className="md:flex items-center justify-end mt-5">
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center w-full justify-center rounded-md bg-blue-950 mt-6 md:mt-0 px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
                      >
                        {isLoading ? (
                          <div
                            className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full my-1 mx-2"
                            role="status"
                            aria-label="loading"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          "Create"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-10">
                <p className="text-sm text-center">
                  By registering you agree to the Ameritex{" "}
                  <Link
                    href="#"
                    className="cursor-pointer text-blue-700 font-semibold hover:underline"
                  >
                    Terms of Use
                  </Link>
                  .
                </p>
                <p className="text-sm text-center mt-2">
                  Already have an account?{" "}
                  <Link
                    href="/"
                    className="cursor-pointer text-blue-700 font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
                <p className="text-sm md:flex items-center justify-center mt-2 text-center">
                  &copy; 2023 AmeriTex Pipe & Products with
                  <span className="inline-flex">
                    <HeartIcon className="h-4 w-4 text-red-600 mx-1 translate-y-1 md:translate-y-0" />
                  </span>
                  by Ieko Media
                </p>
              </div>
            </div>
            {/* End of registration form */}
          </div>
        </div>

        <Slider />
      </div>
    </>
  )
}

export default Content
