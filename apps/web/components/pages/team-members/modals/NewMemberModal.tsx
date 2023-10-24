// import { Fragment, useState } from "react"
// import { Dialog, Transition } from "@headlessui/react"

// import { HeartIcon } from "@heroicons/react/24/solid"
// import Image from "next/image"
// import Link from "next/link"
// import DarkLogo from "../../../assets/logo/logo-dark.png"
// import { useForm } from "react-hook-form"
// import useRegister from "../../../../hooks/users/useRegister"
// import { useRouter } from "next/navigation"
// import { T_User, T_UserStatus } from "custom-validator/ZUser"
// import toast from "react-hot-toast"
// import { T_BackendResponse } from "custom-validator"
// import { USER_ROLES } from "../../../../helpers/constants"
// import useLocations from "../../../../hooks/locations/useLocations"
// import { useQueryClient } from "@tanstack/react-query"
// import useUpdateUser from "../../../../hooks/users/useUpdateUser"
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
// import useStoreSession from "../../../../../../apps/web/store/useStoreSession"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { useForm } from "react-hook-form"
import useRegister from "../../../../hooks/users/useRegister"
import { useRouter } from "next/navigation"
import { T_User, T_UserStatus } from "custom-validator/ZUser"
import useProfile from "../../../../hooks/users/useProfile"
import toast from "react-hot-toast"
import { T_BackendResponse } from "custom-validator"
import { USER_ROLES, USER_STATUSES } from "../../../../helpers/constants"
import useLocations from "../../../../hooks/locations/useLocations"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

interface NewModalProps {
  isOpen: boolean
  onClose: () => void
}

const NewMemberModal = ({ isOpen, onClose }: NewModalProps) => {
  const [isDeleted, setIsDeleted] = useState(false)
  const [isNotChecked, setIsNotChecked] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { data: userProfile, isLoading: isProfileLoading } = useProfile()
  const [action, setAction] = useState<T_UserStatus | null>(null)
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }
  const { data: locations, isLoading: isLocationsLoading } = useLocations()
  const [password, setPassword] = useState("")
  const { register, handleSubmit, reset } = useForm<T_User>()
  const { mutate, isLoading } = useRegister()
  const router = useRouter()

  const close = () => {
    onClose()
    setIsDeleted(false)
  }
  const onSubmit = (data: T_User) => {
    const callBackReq = {
      onSuccess: (data: T_BackendResponse) => {
        console.log(data)
        if (!data.error) {
          // router.push("/team-members");
          resetForm()
        } else {
          toast.error(String(data.message))
        }
      },
      onError: (err: any) => {
        toast.error(String(err))
      },
    }

    mutate({ ...data, status: "Pending" }, callBackReq)
  }

  const resetForm = () => {
    reset()
    setPassword("")
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

  // const callBackReq = {
  //   onSuccess: (returnData: T_BackendResponse) => {
  //     if (!returnData.error) {
  //       if (returnData.item) {
  //         queryClient.invalidateQueries({
  //           queryKey: ["paginated-users"],
  //         })
  //         onClose()
  //         toast.success(`User ${status}`)
  //       }
  //     } else {
  //       toast.error(returnData.message as string)
  //     }
  //   },
  //   onError: (err: any) => {
  //     toast.error(String(err))
  //   },
  // }

  // const formatStatus = (status: T_UserStatus) => {
  //   switch (status) {
  //     case "Rejected":
  //       return "reject"
  //     case "Blocked":
  //       return "block"
  //     case "Archived":
  //       return "delete"
  //   }
  // }

  const handleCheckboxChange = () => {
    console.log(isNotChecked)
    setIsNotChecked(!isNotChecked)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-10 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6">
                <div className="text-3xl text-center w-full">
                  <span className="font-semibold">Add New Member</span>
                </div>
                <Dialog.Title>
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
                              <option
                                className="uppercase"
                                key={key}
                                value={key}
                              >
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
                              onChange={(e) =>
                                setPassword(e.currentTarget.value)
                              }
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
                        <div className="md:flex items-center justify-end mt-5">
                          <div className="flex space-x-2">
                            <button
                              onClick={close}
                              className=" justify-center uppercase flex items-center rounded-md bg-white mt-4 w-full md:w-auto md:mt-0 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-70"
                            >
                              Cancel
                            </button>
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
                                "CREATE"
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* End of registration form */}
                </Dialog.Title>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default NewMemberModal
