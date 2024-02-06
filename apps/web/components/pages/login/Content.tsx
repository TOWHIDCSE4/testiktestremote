"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Link from "next/link"
import DarkLogo from "../../../assets/logo/logo-dark.png"
import Slider from "../../Slider"
import useLogin from "../../../hooks/users/useLogin"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { T_BackendResponse } from "custom-validator"
import { useEffect, useState } from "react"
import { FormGroup } from "@mui/material"

const Content = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }
  const router = useRouter()
  const { mutate, isLoading } = useLogin()
  const onSubmit = (data: { email: string; password: string }) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        if (!data.error) {
          if (data.item) {
            Cookies.set("tfl", data.item?.token)
            router.push(`/profile-home`)
          } else {
            toast.error(String(data.message ?? "Something went wrong!"))
          }
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }
    mutate(data, callBackReq)
  }

  useEffect(() => {
    // const tfl = Cookies.get("tfl")
    // if (tfl) {
    //   router.push(`/profile-home`)
    // }
  }, [])

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
                Sign in to your account
              </p>
            </div>

            {/* Login form */}
            <div className="mt-8">
              <div>
                <FormGroup className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        value={email ?? ""}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        disabled={isLoading}
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <div className="mt-2 relative rounded-md shadow-sm">
                        <input
                          id="password"
                          value={password ?? ""}
                          onChange={(e) => setPassword(e.target.value)}
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          disabled={isLoading}
                          required
                          className="block w-full rounded-md border-0 py-1.5 pr-12 pl-4 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6 disabled:opacity-70"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            togglePasswordVisibility()
                          }}
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
                  <div className="md:flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        disabled={isLoading}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600 disabled:opacity-70"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                      >
                        Remember me
                      </label>
                    </div>
                    <div>
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault()
                          if (email && password) {
                            onSubmit({ email, password })
                          } else {
                            toast.error("Please fill all the fields")
                          }
                        }}
                        disabled={isLoading}
                        className="flex items-center w-full justify-center rounded-md bg-blue-950 mt-6 md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70"
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
                          "Login"
                        )}
                      </button>
                    </div>
                  </div>
                </FormGroup>
              </div>
              <div className="mt-10">
                <p className="text-sm text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="cursor-pointer text-blue-700 font-semibold hover:underline"
                  >
                    Create account
                  </Link>
                </p>
                <p className="text-sm md:flex items-center justify-center mt-2 text-center whitespace-nowrap">
                  &copy; 2023 AmeriTex Pipe & Products, made with
                  <span className="inline-flex">
                    <HeartIcon className="h-4 w-4 text-red-600 mx-1 translate-y-1 md:translate-y-0" />
                  </span>
                  by Ieko Media
                </p>
              </div>
            </div>
            {/* End of login form */}
          </div>
        </div>
        <Slider />
      </div>
    </>
  )
}

export default Content
