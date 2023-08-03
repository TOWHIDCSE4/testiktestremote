"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useState } from "react"
import DropDownMenu from "../../DropDownMenu"
import Link from "next/link"

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
  const [isSignUp, setSignUp] = useState(false)
  return (
    <>
      <div className="flex min-h-screen flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h1 className="text-center">Logo</h1>
              <h2 className="mt-4 text-md text-center font-bold leading-9 tracking-tight text-gray-900">
                Welcome
              </h2>
              <p className="text-sm font-semibold text-gray-900 text-center">
                Sign {isSignUp ? "up" : "in"} to APMS
              </p>
            </div>
            {/* Login form */}
            <div className={`${isSignUp ? "hidden" : ""} mt-8`}>
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
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-950 focus:ring-blue-600"
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
                        Log In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="mt-10">
                <p className="text-sm text-center">
                  Don&apos;t have an account?{" "}
                  <span
                    className="cursor-pointer text-blue-700"
                    onClick={() => setSignUp(true)}
                  >
                    Sign-up now
                  </span>
                  .
                </p>
                <p className="text-sm flex items-center justify-center mt-7">
                  &copy; 2023 AmeriTex Pipe & Products with{" "}
                  <HeartIcon className="h-4 w-4 text-red-600 mx-1" /> by Ieko
                  Media.
                </p>
              </div>
            </div>
            {/* End of login form */}
            {/* Registration form */}
            <div className={`${isSignUp ? "" : "hidden"} mt-8`}>
              <div>
                <form action="#" method="POST" className="space-y-5">
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
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>
                  <DropDownMenu menuList={department} optionText="ROLE" />
                  <DropDownMenu menuList={location} optionText="LOCATION" />
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
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                  <span
                    className="cursor-pointer text-blue-700"
                    onClick={() => setSignUp(false)}
                  >
                    Sign-in now
                  </span>
                  .
                </p>
                <p className="text-sm flex items-center justify-center mt-9">
                  &copy; 2023 AmeriTex Pipe & Products with{" "}
                  <HeartIcon className="h-4 w-4 text-red-600 mx-1" /> by Ieko
                  Media.
                </p>
              </div>
            </div>
            {/* End of registration form */}
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            fill
            className="absolute inset-0 h-full w-full object-cover"
            alt="Carousel image"
          />
          <div className="flex items-center justify-center h-full">
            <h1 className="uppercase absolute text-[5vw] text-white font-semibold tracking-wider">
              SUSTAINABILITY
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Content
