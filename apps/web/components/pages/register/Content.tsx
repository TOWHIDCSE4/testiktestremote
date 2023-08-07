"use client"
import { HeartIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { Fragment, useState } from "react"
import Link from "next/link"
import DarkLogo from "../../../assets/logo/logo-dark.png"
import Slider from "../../Slider"
import { I_User, T_BACKEND_RESPONSE } from "../../../types/global"
import { set, useForm, Controller } from "react-hook-form"
import useRegisterUser from "../../../hooks/users/useRegister"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

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

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

const Content = () => {
  const [password, setPassword] = useState("")
  const [confirmPass, setConfirmPass] = useState("")

  const { register, handleSubmit, reset, control } = useForm<I_User>()
  const { mutate, isLoading } = useRegisterUser()

  const [selectedDepartment, setSelectedDepartment] = useState(department[0])
  const [selectedLocation, setSelectedLocation] = useState(location[0])

  const optionsDepartment = department.slice(1)
  const optionsLocation = location.slice(1)

  const router = useRouter()

  const onSubmit = (data: I_User) => {
    if (password === confirmPass) {
      const callBackReq = {
        onSuccess: (data: T_BACKEND_RESPONSE) => {
          if (!data.error) {
            router.push("/")
            resetForm()
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
      toast.error("Password doesn't match")
    }
  }

  const resetForm = () => {
    reset()
    setSelectedDepartment(department[0])
    setSelectedLocation(department[0])
    setPassword("")
    setConfirmPass("")
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-x-3">
                    <input
                      type="text"
                      className="hidden"
                      {...register("profile")}
                      value={""}
                    />
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
                          {...register("lastName", { required: true })}
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>

                  <Controller
                    control={control}
                    name="role"
                    render={({ field: { onChange } }) => (
                      <Listbox
                        as="div"
                        value={selectedDepartment}
                        onChange={(e) => {
                          onChange(e.name)
                          setSelectedDepartment(e)
                        }}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium text-gray-900 mt-4">
                              Department
                            </Listbox.Label>
                            <div className="relative mt-2">
                              <Listbox.Button
                                className={`${
                                  selectedDepartment === department[0]
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                } relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6`}
                              >
                                <span className="block truncate">
                                  {selectedDepartment.name}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 border-l border-gray-300 my-2">
                                  <ChevronDownIcon
                                    className="h-5 w-5 text-gray-900 ml-2"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <span className="py-2 pl-3 pr-9 select-none text-xs text-gray-400">
                                    ROLE
                                  </span>
                                  {optionsDepartment.map((department) => (
                                    <Listbox.Option
                                      key={department.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-blue-300 text-white"
                                            : "text-gray-900",
                                          "relative cursor-pointer select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={department}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {department.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-blue-950",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    )}
                  />
                  <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange } }) => (
                      <Listbox
                        value={selectedLocation}
                        onChange={(e) => {
                          onChange(e.name)
                          setSelectedLocation(e)
                        }}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium text-gray-900 mt-4">
                              Location
                            </Listbox.Label>
                            <div className="relative mt-2">
                              <Listbox.Button
                                className={`${
                                  selectedLocation === location[0]
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                } relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-950 sm:text-sm sm:leading-6`}
                              >
                                <span className="block truncate">
                                  {selectedLocation.name}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 border-l border-gray-300 my-2">
                                  <ChevronDownIcon
                                    className="h-5 w-5 text-gray-900 ml-2"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>
                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  <span className="py-2 pl-3 pr-9 select-none text-xs text-gray-400">
                                    ROLE
                                  </span>
                                  {optionsLocation.map((location) => (
                                    <Listbox.Option
                                      key={location.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "bg-blue-300 text-white"
                                            : "text-gray-900",
                                          "relative cursor-pointer select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={location}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {location.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-blue-950",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    )}
                  />

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
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
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
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-950 sm:text-sm sm:leading-6"
                        placeholder="Confirm Password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <div className="md:flex items-center justify-end mt-4">
                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full justify-center rounded-md bg-blue-950 mt-6 md:mt-0 px-4 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
                  <Link href="#" className="cursor-pointer text-blue-700">
                    Terms of Use
                  </Link>
                  .
                </p>
                <p className="text-sm text-center mt-2">
                  Already have an account?{" "}
                  <Link href="/" className="cursor-pointer text-blue-700">
                    Sign-in now
                  </Link>
                  .
                </p>
                <p className="text-sm md:flex items-center justify-center mt-2 text-center">
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
