"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import Link from "next/link"
import { UsersZodSchema } from "zod-schema"
import DarkLogo from "../../../assets/logo/logo-dark.png"
import Slider from "../../Slider"
import useLoginUser from "../../../hooks/users/useLogin"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

type I_USER = {
  email: string
  password: string
}
const Content = () => {
  const testUser = UsersZodSchema.safeParse({
    email: "jp.madrigal07@gmail.com",
    password: "patrick22",
  })
  console.log("Test User: ", testUser)
  const { register, handleSubmit, reset } = useForm<I_USER>()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useLoginUser()

  const onSubmit = (data: I_USER) => {
    const callBackReq = {
      onSuccess: (data: any) => {
        if (typeof data === "object") {
          queryClient.invalidateQueries({ queryKey: ["users"] })
          reset()
          router.push(`/profile-home`)
        } else {
          console.log("error")
        }
      },
      onError: (err: any) => {
        console.log(err)
      },
    }
    mutate(data, callBackReq)
  }

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
                Sign in to APMS
              </p>
            </div>
            {/* Login form */}
            <div className="mt-8">
              <div>
                <form action="#" method="POST" className="space-y-5">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        {...register("email", { required: true })}
                        name="email"
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                        placeholder="Enter Username"
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
                      <input
                        id="password"
                        {...register("password", { required: true })}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                        placeholder="Enter Password"
                      />
                    </div>
                  </div>
                  <div className="md:flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-1 focus:ring-blue-600"
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
                        className="flex w-full justify-center rounded-md bg-blue-950 mt-6 md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        {isLoading ? (
                          <div
                            className="animate-spin inline-block w-[20px] h-[20px] border-[2px] border-current border-t-transparent text-white rounded-full"
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
                </form>
              </div>
              <div className="mt-10">
                <p className="text-sm text-center">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="cursor-pointer text-blue-700"
                  >
                    Sign-up now
                  </Link>
                  .
                </p>
                <p className="text-sm md:flex items-center justify-center mt-7 text-center">
                  &copy; 2023 AmeriTex Pipe & Products with
                  <span className="inline-flex">
                    <HeartIcon className="h-4 w-4 text-red-600 mx-1 translate-y-1 md:translate-y-0" />
                  </span>
                  by Ieko Media.
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
