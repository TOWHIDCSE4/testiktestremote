"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import GifTick from "../../../assets/images/sliders/icontick.png"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }
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
            setTimeout(() => {
              router.push("/")
              resetForm()
            }, 5000)
          } else {
            toast.error(String(data.message))
          }
        },
        onError: (err: any) => {
          toast.error(String(err))
        },
      }

      mutate({ ...data, status: "Pending" }, callBackReq)
    } else {
      toast.error("Password doesn't match")
    }
  }

  const handleCreateButtonClick = () => {
    setShowWelcome(true)

    setTimeout(() => {
      setShowWelcome(false)
    }, 10000)
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
                        <span className="text-red-500 text-lg">{" *"}</span>
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
                        <span className="text-red-500 text-lg">{" *"}</span>
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
                      <span className="text-red-500 text-lg">{" *"}</span>
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
                      <span className="text-red-500 text-lg">{" *"}</span>
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
                      <span className="text-red-500 text-lg">{" *"}</span>
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
                      <span className="text-red-500 text-lg">{" *"}</span>
                    </label>
                    <div className="mt-2 relative">
                      <input
                        id="reg-pass"
                        {...register("password", { required: true })}
                        disabled={isLoading}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
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
                  <div className="mt-4">
                    <label
                      htmlFor="confirm-pass"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                      <span className="text-red-500 text-lg">{" *"}</span>
                    </label>
                    <div className="mt-2 relative">
                      <input
                        id="confirm-pass"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        placeholder="Confirm Password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.currentTarget.value)}
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
                  <div className="md:flex items-center justify-end mt-5">
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        onClick={handleCreateButtonClick}
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
      {showWelcome && (
        <div className="fixed top-0 left-0 w-full h-full items-center justify-center bg-white z-50 flex flex-col">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#1e3a8a"
              className="w-[300px] h-[200px]"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className=" p-4 rounded-md text-white space-y-4">
            <h1 className=" font-roboto text-blue-700 bg-clip-text text-8xl font-black">
              WELCOME
            </h1>
            {/* <h1 className="animate-text font-sans bg-gradient-to-r outline-1 outline-black from-blue-900 via-blue-500 to-blue-900 bg-clip-text text-transparent text-8xl font-black">
              THANK YOU
            </h1> */}
          </div>
          <span className="text-3xl tracking-tight font-semibold text-justify text-black">
            You will be redirected to login page shortly
          </span>
        </div>
      )}
    </>
  )
}

export default Content
