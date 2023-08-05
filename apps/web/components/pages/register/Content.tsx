"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useState } from "react"
import DropDownMenu from "../../DropDownMenu"
import Link from "next/link"
import DarkLogo from "../../../assets/logo/logo-dark.png"
import Slider from "../../Slider"
import { I_User } from "../../../types/global"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import useRegisterUser from "../../../hooks/users/useRegister"

const department = [
  { id: 0, name: "Select..." },
  { id: 1, name: "Administrator" },
  { id: 2, name: "Corporate" },
  { id: 3, name: "Production" },
  { id: 4, name: "Personnel" },
]

const location = [
  { id: 0, name: "Select Location" },
  { id: 1, name: "Seguin" },
  { id: 2, name: "Conroe" },
  { id: 3, name: "Gunter" },
]

const Content = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm<I_User>()
  const { mutate, isLoading } = useRegisterUser()

  const onSubmit = (data: I_User) => {
    const callBackReq = {
      onSuccess: (data: any) => {
        if (typeof data === "object") {
          queryClient.invalidateQueries({ queryKey: ["users"] })
          console.log("success")
          reset()
        } else {
          console.log(data)
        }
      },
      onError: (err: any) => {
        console.log("error")
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
                Sign up to APMS
              </p>
            </div>
            {/* Registration form */}
            <div className="mt-8">
              <div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                          name="first-name"
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                          name="last-name"
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                  <DropDownMenu
                    labelText="Department"
                    menuList={department}
                    optionText="ROLE"
                  />
                  <DropDownMenu
                    labelText="Location"
                    menuList={location}
                    optionText="LOCATION"
                  />
                  <div>
                    <label
                      htmlFor="email-add"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email-add"
                        name="email-add"
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                        placeholder="Enter Email"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="reg-pass"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="reg-pass"
                        name="reg-pass"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                        placeholder="Enter Password"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-pass"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="confirm-pass"
                        name="confirm-pass"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                        placeholder="Confirm Password"
                      />
                    </div>
                  </div>
                  <div className="md:flex items-center justify-end">
                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-blue-950 mt-6 md:mt-0 px-7 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-10">
                <p className="text-sm text-center">
                  By registering you agree to the Ameritex{" "}
                  <Link href="#" className="cursor-pointer text-blue-700">
                    Terms of Use
                  </Link>
                  .
                </p>
                <p className="text-sm text-center mt-7">
                  Already have an account?{" "}
                  <Link href="/" className="cursor-pointer text-blue-700">
                    Sign-in now
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
            {/* End of registration form */}
          </div>
        </div>

        <Slider />
      </div>
    </>
  )
}

export default Content
